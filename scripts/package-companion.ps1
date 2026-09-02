[CmdletBinding()]
param(
  [ValidateSet('production', 'development')]
  [string]$Mode = 'production',
  [string]$OutputPath
)

$ErrorActionPreference = 'Stop'

$repository = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$source = Join-Path $repository 'companion\qcg-devtools-extension'
$version = (Get-Content -LiteralPath (Join-Path $source 'package.json') -Raw | ConvertFrom-Json).version
$manifest = if ($Mode -eq 'development') { 'manifest.dev.json' } else { 'manifest.json' }
$defaultOutput = if ($Mode -eq 'development') {
  Join-Path $repository "evidence\releases\qcg-console-companion-dev-$version.zip"
} else {
  Join-Path $repository "prototype\webmcp-qcg\public\downloads\qcg-console-companion-$version.zip"
}
$archive = if ($OutputPath) { $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputPath) } else { $defaultOutput }
$archiveDirectory = Split-Path -Parent $archive
New-Item -ItemType Directory -Path $archiveDirectory -Force | Out-Null
$publicFileName = if ($Mode -eq 'development') { "qcg-console-companion-dev-$version.zip" } else { "qcg-console-companion-$version.zip" }
$publicDestinations = @(
  Join-Path $repository "prototype\webmcp-qcg\public\$publicFileName"
  Join-Path $repository "prototype\webmcp-qcg\public\downloads\$publicFileName"
)

$runtimeFiles = @(
  'background.js',
  'contentBridge.js',
  'devtools.html',
  'devtools.js',
  'icons\inspector-q-avatar.jpg',
  'icons\qcg-16.png',
  'icons\qcg-32.png',
  'icons\qcg-48.png',
  'icons\qcg-128.png',
  'panel.css',
  'panel.html',
  'panel.js',
  'pageBridge.js',
  'snapshotSanitizer.js',
  'INSTALL.md'
)

$temporaryRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
$staging = Join-Path $temporaryRoot ("qcg-companion-package-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $staging | Out-Null

try {
  Copy-Item -LiteralPath (Join-Path $source $manifest) -Destination (Join-Path $staging 'manifest.json')
  foreach ($name in $runtimeFiles) {
    $destination = Join-Path $staging $name
    New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $source $name) -Destination $destination
  }
  Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $archive -CompressionLevel Optimal -Force
} finally {
  $resolvedStaging = [IO.Path]::GetFullPath($staging)
  if (-not $resolvedStaging.StartsWith($temporaryRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove a staging path outside the operating-system temporary directory: $resolvedStaging"
  }
  if (Test-Path -LiteralPath $resolvedStaging) {
    Remove-Item -LiteralPath $resolvedStaging -Recurse -Force
  }
}

foreach ($destination in $publicDestinations) {
  New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
  if ([IO.Path]::GetFullPath($destination) -ne [IO.Path]::GetFullPath($archive)) {
    Copy-Item -LiteralPath $archive -Destination $destination -Force
  }
}

[pscustomobject]@{
  mode = $Mode
  version = $version
  path = $archive
  bytes = (Get-Item -LiteralPath $archive).Length
  sha256 = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash
  entries = @(tar -tf $archive)
  publicCopies = $publicDestinations
} | ConvertTo-Json -Depth 4
