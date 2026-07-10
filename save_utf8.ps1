$htmlPath = "c:\Users\gmdoh\Desktop\korPh\personal.html"
$jsPath = "c:\Users\gmdoh\Desktop\korPh\script.js"
$cssPath = "c:\Users\gmdoh\Desktop\korPh\style.css"

if (Test-Path $htmlPath) {
    $content = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($htmlPath, $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Output "Successfully saved personal.html in UTF-8 without BOM."
}

if (Test-Path $jsPath) {
    $content = [System.IO.File]::ReadAllText($jsPath, [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($jsPath, $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Output "Successfully saved script.js in UTF-8 without BOM."
}

if (Test-Path $cssPath) {
    $content = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($cssPath, $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Output "Successfully saved style.css in UTF-8 without BOM."
}
