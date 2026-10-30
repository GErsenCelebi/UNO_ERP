param([switch]$Quiet, [switch]$Aggressive)
$currentPid = $PID

# Kill any process listening on port 8001
try {
    Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue | ForEach-Object {
        if ($_.OwningProcess -and $_.OwningProcess -ne $currentPid) {
            try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
        }
    }
} catch {}

# Also kill any Uno_API.dll process
try {
    Get-CimInstance Win32_Process | Where-Object { 
        $_.ProcessId -ne $currentPid -and
        $_.CommandLine -notlike "*test*" -and
        $_.CommandLine -notlike "*build*" -and
        $_.CommandLine -notlike "*MSBuild*" -and
        (
            ($_.CommandLine -like "*Uno_API.dll*" -or $_.CommandLine -like "*bin\Debug\net10.0\Uno_API.dll*" -or $_.CommandLine -like "*Uno_API\bin\*") -or 
            $_.Name -eq "Uno_API.exe"
        )
    } | ForEach-Object {
        try {
            Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
        } catch {}
    }
} catch {}
