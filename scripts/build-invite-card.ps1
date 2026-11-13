$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot
$copy = Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot 'invite-card-copy.json') | ConvertFrom-Json
function Brush($hex) { [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex)) }
foreach ($entry in $copy.PSObject.Properties) {
  $bmp = [System.Drawing.Bitmap]::new(1200,630)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAliasGridFit'
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#fff6ef'))
  $ink=Brush '#222222'; $muted=Brush '#6a615b'; $coral=Brush '#f4685f'; $white=Brush '#ffffff'; $park=Brush '#e1eddf'; $water=Brush '#d5e9ef'
  $g.FillRectangle($white,655,0,545,630)
  $g.FillEllipse($park,700,35,330,240); $g.FillEllipse($park,925,400,310,260)
  $river=[System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#d5e9ef'),85)
  $g.DrawBezier($river,1130,-40,880,160,1140,390,830,690)
  $road=[System.Drawing.Pen]::new([System.Drawing.Color]::White,22)
  foreach($y in @(160,350,530)) {$g.DrawLine($road,665,$y,1200,($y-80))}
  $g.DrawLine($road,760,0,930,630); $g.DrawLine($road,1080,0,720,630)
  foreach($pin in @(@(785,220,1),@(1050,125,0),@(980,440,0))) {
    $x=$pin[0];$y=$pin[1];$s=if($pin[2]){1.3}else{0.9};$r=[single](38*$s)
    $g.FillEllipse($coral,[single]($x-$r),[single]($y-$r),[single](2*$r),[single](2*$r))
    $triangle=[System.Drawing.PointF[]]@([System.Drawing.PointF]::new($x-28*$s,$y+22*$s),[System.Drawing.PointF]::new($x+28*$s,$y+22*$s),[System.Drawing.PointF]::new($x,$y+64*$s))
    $g.FillPolygon($coral,$triangle);$g.FillEllipse($white,[single]($x-12*$s),[single]($y-12*$s),[single](24*$s),[single](24*$s))
  }
  $logo=[System.Drawing.Image]::FromFile((Join-Path $root 'assets/OurPins_transparent.png'))
  $g.DrawImage($logo,62,62,300,72);$logo.Dispose()
  $headline=[System.Drawing.Font]::new('Segoe UI',51,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawString("Good places.`nBetter together.",$headline,$ink,[single]60,[single]220)
  $fontName=switch($entry.Name){'zh-Hans'{'Microsoft YaHei'}'zh-Hant'{'Microsoft JhengHei'}'ko'{'Malgun Gothic'}default{'Yu Gothic'}}
  $sub=[System.Drawing.Font]::new($fontName,25,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
  if($entry.Name -ne 'en'){$g.DrawString([string]$entry.Value,$sub,$ink,[single]62,[single]402)}
  $small=[System.Drawing.Font]::new('Segoe UI',20,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawString('ourpins.app',$small,$muted,[single]64,[single]537)
  $bmp.Save((Join-Path $root "assets/invite-card-$($entry.Name)-v1.png"),[System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose();$bmp.Dispose();$river.Dispose();$road.Dispose();$headline.Dispose();$sub.Dispose();$small.Dispose()
  foreach($b in @($ink,$muted,$coral,$white,$park,$water)){$b.Dispose()}
}
Write-Output 'Built 5 opaque 1200 x 630 invitation cards.'
