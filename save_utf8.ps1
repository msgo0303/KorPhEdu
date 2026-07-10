$files = @(
    "c:\Users\gmdoh\Desktop\korPh\index.html",
    "c:\Users\gmdoh\Desktop\korPh\Menu_1.html",
    "c:\Users\gmdoh\Desktop\korPh\Menu_2.html",
    "c:\Users\gmdoh\Desktop\korPh\Menu_3.html",
    "c:\Users\gmdoh\Desktop\korPh\Menu_2_1.html",
    "c:\Users\gmdoh\Desktop\korPh\Menu_2_2.html",
    "c:\Users\gmdoh\Desktop\korPh\Menu_2_3.html",
    "c:\Users\gmdoh\Desktop\korPh\personal.html",
    "c:\Users\gmdoh\Desktop\korPh\admin.html",
    "c:\Users\gmdoh\Desktop\korPh\script.js",
    "c:\Users\gmdoh\Desktop\korPh\style.css"
)

foreach ($filePath in $files) {
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
        [System.IO.File]::WriteAllText($filePath, $content, (New-Object System.Text.UTF8Encoding $false))
        Write-Output "Successfully saved $filePath in UTF-8 without BOM."
    }
}
