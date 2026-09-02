[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$sourceRoot = Join-Path $repoRoot 'asset\logo'
$iconSource = Join-Path $sourceRoot 'icône app.png'
$socialSource = Join-Path $sourceRoot 'thumbnail GitHub.png'
$mascotSource = Join-Path $repoRoot 'asset\mascotte-inspecteur Q\mascotte — Inspector Q.png'
$webRoot = Join-Path $repoRoot 'prototype\webmcp-qcg\public\brand'
$extensionRoot = Join-Path $repoRoot 'companion\qcg-devtools-extension\icons'
$receiptPath = Join-Path $repoRoot 'evidence\releases\qcg-brand-runtime-manifest.json'

foreach ($required in @($iconSource, $socialSource, $mascotSource)) {
  if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
    throw "Required brand source is missing: $required"
  }
}

Add-Type -AssemblyName System.Drawing

function New-TransparentIconMaster {
  param([Parameter(Mandatory)][string]$Path)

  $source = [System.Drawing.Bitmap]::FromFile($Path)
  try {
    $master = [System.Drawing.Bitmap]::new(
      $source.Width,
      $source.Height,
      [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
    )
    $graphics = [System.Drawing.Graphics]::FromImage($master)
    try {
      $graphics.DrawImageUnscaled($source, 0, 0)
    } finally {
      $graphics.Dispose()
    }

    # The supplied app icon is RGB. Remove only the near-black exterior that is
    # connected to the canvas edge; dark detail inside the emblem is preserved.
    $width = $master.Width
    $height = $master.Height
    $visited = [bool[]]::new($width * $height)
    $queue = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()

    function Add-ExteriorPixel {
      param([int]$X, [int]$Y)
      if ($X -lt 0 -or $Y -lt 0 -or $X -ge $width -or $Y -ge $height) { return }
      $index = ($Y * $width) + $X
      if ($visited[$index]) { return }
      $visited[$index] = $true
      $pixel = $master.GetPixel($X, $Y)
      if ($pixel.R -le 18 -and $pixel.G -le 18 -and $pixel.B -le 18) {
        $queue.Enqueue([System.Drawing.Point]::new($X, $Y))
      }
    }

    for ($x = 0; $x -lt $width; $x++) {
      Add-ExteriorPixel -X $x -Y 0
      Add-ExteriorPixel -X $x -Y ($height - 1)
    }
    for ($y = 0; $y -lt $height; $y++) {
      Add-ExteriorPixel -X 0 -Y $y
      Add-ExteriorPixel -X ($width - 1) -Y $y
    }

    while ($queue.Count -gt 0) {
      $point = $queue.Dequeue()
      $pixel = $master.GetPixel($point.X, $point.Y)
      $master.SetPixel($point.X, $point.Y, [System.Drawing.Color]::FromArgb(0, $pixel.R, $pixel.G, $pixel.B))
      Add-ExteriorPixel -X ($point.X - 1) -Y $point.Y
      Add-ExteriorPixel -X ($point.X + 1) -Y $point.Y
      Add-ExteriorPixel -X $point.X -Y ($point.Y - 1)
      Add-ExteriorPixel -X $point.X -Y ($point.Y + 1)
    }

    return $master
  } finally {
    $source.Dispose()
  }
}

function Save-ResizedPng {
  param(
    [Parameter(Mandatory)][System.Drawing.Bitmap]$Source,
    [Parameter(Mandatory)][int]$Size,
    [Parameter(Mandatory)][string]$Destination
  )

  $target = [System.Drawing.Bitmap]::new($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($target)
  try {
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($Source, [System.Drawing.Rectangle]::new(0, 0, $Size, $Size))
    $target.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $graphics.Dispose()
    $target.Dispose()
  }
}

function Save-CroppedJpeg {
  param(
    [Parameter(Mandatory)][string]$SourcePath,
    [Parameter(Mandatory)][System.Drawing.Rectangle]$SourceRectangle,
    [Parameter(Mandatory)][int]$Size,
    [Parameter(Mandatory)][string]$Destination
  )

  $source = [System.Drawing.Bitmap]::FromFile($SourcePath)
  try {
    $target = [System.Drawing.Bitmap]::new($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($target)
    try {
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.DrawImage(
        $source,
        [System.Drawing.Rectangle]::new(0, 0, $Size, $Size),
        $SourceRectangle,
        [System.Drawing.GraphicsUnit]::Pixel
      )
      $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg' | Select-Object -First 1
      $quality = [System.Drawing.Imaging.EncoderParameters]::new(1)
      try {
        $quality.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]88)
        $target.Save($Destination, $codec, $quality)
      } finally {
        $quality.Dispose()
      }
    } finally {
      $graphics.Dispose()
      $target.Dispose()
    }
  } finally {
    $source.Dispose()
  }
}

New-Item -ItemType Directory -Force -Path $webRoot, $extensionRoot, (Split-Path -Parent $receiptPath) | Out-Null

$master = New-TransparentIconMaster -Path $iconSource
try {
  foreach ($size in @(16, 32, 48, 128, 180, 192, 512)) {
    Save-ResizedPng -Source $master -Size $size -Destination (Join-Path $webRoot "qcg-icon-$size.png")
  }
  foreach ($size in @(16, 32, 48, 128)) {
    Save-ResizedPng -Source $master -Size $size -Destination (Join-Path $extensionRoot "qcg-$size.png")
  }
} finally {
  $master.Dispose()
}

Copy-Item -LiteralPath $socialSource -Destination (Join-Path $webRoot 'qcg-social-card.png') -Force
$mascotCrop = [System.Drawing.Rectangle]::new(220, 80, 680, 680)
Save-CroppedJpeg -SourcePath $mascotSource -SourceRectangle $mascotCrop -Size 256 -Destination (Join-Path $webRoot 'inspector-q-avatar.jpg')
Copy-Item -LiteralPath (Join-Path $webRoot 'inspector-q-avatar.jpg') -Destination (Join-Path $extensionRoot 'inspector-q-avatar.jpg') -Force

$outputs = @(
  Get-ChildItem -LiteralPath $webRoot -File
  Get-ChildItem -LiteralPath $extensionRoot -File
) | Sort-Object FullName | ForEach-Object {
  [ordered]@{
    path = [System.IO.Path]::GetRelativePath($repoRoot, $_.FullName).Replace('\', '/')
    bytes = $_.Length
    sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
  }
}

$receipt = [ordered]@{
  schema_version = 'webmcp-qcg.brand-runtime-manifest.v1'
  generated_at = [DateTimeOffset]::UtcNow.ToString('o')
  sources = @(
    [ordered]@{
      role = 'runtime_icon_master'
      path = [System.IO.Path]::GetRelativePath($repoRoot, $iconSource).Replace('\', '/')
      sha256 = (Get-FileHash -LiteralPath $iconSource -Algorithm SHA256).Hash.ToLowerInvariant()
    },
    [ordered]@{
      role = 'social_card'
      path = [System.IO.Path]::GetRelativePath($repoRoot, $socialSource).Replace('\', '/')
      sha256 = (Get-FileHash -LiteralPath $socialSource -Algorithm SHA256).Hash.ToLowerInvariant()
    },
    [ordered]@{
      role = 'inspector_q_avatar_source'
      path = [System.IO.Path]::GetRelativePath($repoRoot, $mascotSource).Replace('\', '/')
      sha256 = (Get-FileHash -LiteralPath $mascotSource -Algorithm SHA256).Hash.ToLowerInvariant()
    }
  )
  outputs = $outputs
}

$receipt | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $receiptPath -Encoding utf8
Write-Output "Generated $($outputs.Count) runtime brand assets."
Write-Output "Receipt: $receiptPath"
