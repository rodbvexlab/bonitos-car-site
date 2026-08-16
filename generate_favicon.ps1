Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Sites\Bonitos Car - Site\assets\logos\logo_bonitos_novo.png"
$srcImg = [System.Drawing.Image]::FromFile($srcPath)

# Crop central 800x800
$cropRect = New-Object System.Drawing.Rectangle(112, 112, 800, 800)
$targetImg = New-Object System.Drawing.Bitmap(800, 800)
$g = [System.Drawing.Graphics]::FromImage($targetImg)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($srcImg, (New-Object System.Drawing.Rectangle(0, 0, 800, 800)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

function Get-PngBytes($img, $size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g2 = [System.Drawing.Graphics]::FromImage($bmp)
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g2.DrawImage($img, 0, 0, $size, $size)
    $g2.Dispose()
    
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bytes = $ms.ToArray()
    $ms.Dispose()
    $bmp.Dispose()
    return $bytes
}

$png180 = Get-PngBytes $targetImg 180
$png48 = Get-PngBytes $targetImg 48
$png32 = Get-PngBytes $targetImg 32
$png16 = Get-PngBytes $targetImg 16

[System.IO.File]::WriteAllBytes("C:\Sites\Bonitos Car - Site\apple-touch-icon.png", $png180)
[System.IO.File]::WriteAllBytes("C:\Sites\Bonitos Car - Site\assets\favicon-32x32.png", $png32)
[System.IO.File]::WriteAllBytes("C:\Sites\Bonitos Car - Site\assets\favicon-16x16.png", $png16)

$msIco = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($msIco)

$bw.Write([uint16]0)
$bw.Write([uint16]1)
$bw.Write([uint16]3)

$offset = 6 + (16 * 3)

$bw.Write([byte]16); $bw.Write([byte]16); $bw.Write([byte]0); $bw.Write([byte]0)
$bw.Write([uint16]1); $bw.Write([uint16]32)
$bw.Write([uint32]$png16.Length); $bw.Write([uint32]$offset)
$offset += $png16.Length

$bw.Write([byte]32); $bw.Write([byte]32); $bw.Write([byte]0); $bw.Write([byte]0)
$bw.Write([uint16]1); $bw.Write([uint16]32)
$bw.Write([uint32]$png32.Length); $bw.Write([uint32]$offset)
$offset += $png32.Length

$bw.Write([byte]48); $bw.Write([byte]48); $bw.Write([byte]0); $bw.Write([byte]0)
$bw.Write([uint16]1); $bw.Write([uint16]32)
$bw.Write([uint32]$png48.Length); $bw.Write([uint32]$offset)

$bw.Write($png16)
$bw.Write($png32)
$bw.Write($png48)

$bw.Flush()
[System.IO.File]::WriteAllBytes("C:\Sites\Bonitos Car - Site\favicon.ico", $msIco.ToArray())

$bw.Dispose()
$msIco.Dispose()
$targetImg.Dispose()
$srcImg.Dispose()

Write-Output "Favicon files generated successfully."
