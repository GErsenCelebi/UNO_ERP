param([switch]$Quiet, [switch]$Aggressive)
$currentPid = $PID
Get-CimInstance Win32_Process | Where-Object { 
    $_.ProcessId -ne $currentPid -and
    $_.CommandLine -notlike "*test*" -and
    $_.CommandLine -notlike "*build*" -and
    $_.CommandLine -notlike "*MSBuild*" -and
    (
        ($_.CommandLine -like "*Uno_API.dll run*" -or $_.CommandLine -like "*bin\Debug\net10.0\Uno_API.dll*" -or $_.CommandLine -like "*Uno_API\bin\*") -or 
        $_.CommandLine -like "*localhost:5001*" -or 
        $_.CommandLine -like "*localhost:5000*" -or 
        $_.Name -eq "Uno_API.exe"
    )
} | ForEach-Object {
    try {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    } catch {}
}
