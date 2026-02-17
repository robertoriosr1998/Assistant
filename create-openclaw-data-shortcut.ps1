# Create a Windows shortcut to the OpenClaw data folder
$openclawData = Join-Path $env:USERPROFILE ".openclaw"
$shortcutPath = Join-Path $PSScriptRoot "OpenClaw Data.lnk"

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $openclawData
$shortcut.Description = "OpenClaw config and workspace"
$shortcut.Save()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($shell) | Out-Null

Write-Host "Shortcut created: $shortcutPath -> $openclawData"
