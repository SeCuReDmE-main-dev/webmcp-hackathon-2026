param(
  [string]$Uri = 'https://qcg.securedme.ca/',
  [string]$OutputPath = '',
  [int]$SecondsPerStep = 10,
  [int]$TimeoutSeconds = 5
)

$ErrorActionPreference = 'Stop'
$steps = @(1, 2, 5)
$maxRequests = 300
$maxSeconds = 60
$p95LimitMs = 1500.0
$startedAt = [DateTimeOffset]::UtcNow
$wall = [System.Diagnostics.Stopwatch]::StartNew()
$records = [System.Collections.Generic.List[object]]::new()
$stopReasons = [System.Collections.Generic.List[string]]::new()
$client = [System.Net.Http.HttpClient]::new()
$client.DefaultRequestHeaders.UserAgent.ParseAdd('WebMCP-QCG-Day5-Canary/1.0')

function Get-Percentile([double[]]$Values, [double]$Percentile) {
  if ($Values.Count -eq 0) { return $null }
  [Array]::Sort($Values)
  $index = [Math]::Ceiling($Percentile * $Values.Count) - 1
  return $Values[[Math]::Max(0, [Math]::Min($index, $Values.Count - 1))]
}

try {
  foreach ($rps in $steps) {
    $stepStart = $wall.Elapsed.TotalSeconds
    $targetCount = $rps * $SecondsPerStep
    for ($index = 0; $index -lt $targetCount; $index++) {
      if ($records.Count -ge $maxRequests -or $wall.Elapsed.TotalSeconds -ge $maxSeconds) {
        $stopReasons.Add('global_bound')
        break
      }
      $scheduled = $stepStart + ($index / [double]$rps)
      $remaining = $scheduled - $wall.Elapsed.TotalSeconds
      if ($remaining -gt 0) { Start-Sleep -Milliseconds ([int][Math]::Ceiling($remaining * 1000)) }

      $requestWatch = [System.Diagnostics.Stopwatch]::StartNew()
      $status = $null
      $outcome = 'ok'
      try {
        $cts = [System.Threading.CancellationTokenSource]::new([TimeSpan]::FromSeconds($TimeoutSeconds))
        try {
          $response = $client.GetAsync($Uri, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead, $cts.Token).GetAwaiter().GetResult()
          $status = [int]$response.StatusCode
          $response.Dispose()
        } finally {
          $cts.Dispose()
        }
      } catch [System.Threading.Tasks.TaskCanceledException] {
        $outcome = 'timeout'
      } catch {
        $outcome = 'transport_error'
      }
      $requestWatch.Stop()
      $records.Add([pscustomobject]@{
        sequence = $records.Count + 1
        rps_step = $rps
        status = $status
        outcome = $outcome
        latency_ms = [Math]::Round($requestWatch.Elapsed.TotalMilliseconds, 3)
      })

      if ($status -eq 429 -or ($null -ne $status -and $status -ge 500)) {
        $stopReasons.Add('http_stop_status')
        break
      }
      $timeouts = @($records | Where-Object outcome -eq 'timeout').Count
      if ($timeouts -ge 2) {
        $stopReasons.Add('two_timeouts')
        break
      }
      $errors = @($records | Where-Object { $_.outcome -ne 'ok' -or $null -eq $_.status -or $_.status -ge 400 }).Count
      if (($errors / [double]$records.Count) -gt 0.005) {
        $stopReasons.Add('error_rate')
        break
      }
    }
    $latencies = [double[]]@($records | ForEach-Object latency_ms)
    $currentP95 = Get-Percentile $latencies 0.95
    if ($null -ne $currentP95 -and $currentP95 -gt $p95LimitMs) {
      $stopReasons.Add('p95_latency')
    }
    if ($stopReasons.Count -gt 0) { break }
  }
} finally {
  $wall.Stop()
  $client.Dispose()
}

$latencyValues = [double[]]@($records | ForEach-Object latency_ms)
$errorCount = @($records | Where-Object { $_.outcome -ne 'ok' -or $null -eq $_.status -or $_.status -ge 400 }).Count
$receipt = [ordered]@{
  schema_version = 'qcg-http-canary.v1'
  target = $Uri
  started_at = $startedAt.ToString('o')
  completed_at = [DateTimeOffset]::UtcNow.ToString('o')
  status = if ($stopReasons.Count -eq 0) { 'pass' } else { 'stopped' }
  bounds = [ordered]@{ rps_steps = $steps; seconds_per_step = $SecondsPerStep; max_seconds = $maxSeconds; max_requests = $maxRequests; timeout_seconds = $TimeoutSeconds }
  requests = $records.Count
  status_counts = @($records | Group-Object status | ForEach-Object { [ordered]@{ status = $_.Name; count = $_.Count } })
  errors = $errorCount
  error_rate = if ($records.Count) { $errorCount / [double]$records.Count } else { 0 }
  timeouts = @($records | Where-Object outcome -eq 'timeout').Count
  latency_ms = [ordered]@{
    p50 = Get-Percentile $latencyValues 0.50
    p95 = Get-Percentile $latencyValues 0.95
    p99 = Get-Percentile $latencyValues 0.99
    max = if ($latencyValues.Count) { ($latencyValues | Measure-Object -Maximum).Maximum } else { $null }
    stop_limit = $p95LimitMs
  }
  elapsed_seconds = [Math]::Round($wall.Elapsed.TotalSeconds, 3)
  stop_reasons = @($stopReasons)
  engine_benchmark_included = $false
  qpu_calls = 0
  provider_calls = 0
  payment_calls = 0
  observations = @($records)
}

if (-not $OutputPath) {
  $stamp = [DateTimeOffset]::UtcNow.ToString('yyyyMMddTHHmmssZ')
  $OutputPath = Join-Path (Split-Path -Parent $PSScriptRoot) "results/http-canary-$stamp.json"
}
$receipt | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $OutputPath -Encoding utf8
$consoleSummary = [ordered]@{
  schema_version = $receipt.schema_version
  target = $receipt.target
  status = $receipt.status
  requests = $receipt.requests
  errors = $receipt.errors
  timeouts = $receipt.timeouts
  latency_ms = $receipt.latency_ms
  elapsed_seconds = $receipt.elapsed_seconds
  stop_reasons = $receipt.stop_reasons
}
$consoleSummary | ConvertTo-Json -Depth 5
if ($stopReasons.Count -gt 0) { exit 2 }
