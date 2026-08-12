# Run Apps Script for UNO ERP

# 1. Kill any existing processes running on Port 8001 (API) and Port 8000 (CRM) using process tree kill
Get-NetTCPConnection -LocalPort 8001, 8000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Killing process tree on port $($_.LocalPort) (PID: $($_.OwningProcess))..." -ForegroundColor Yellow
    taskkill /PID $_.OwningProcess /F /T 2>$null
}

# 2. Specifically target and kill lingering dotnet or node processes related to this project
Write-Host "Cleaning up lingering Uno ERP processes..." -ForegroundColor Yellow
Get-CimInstance Win32_Process -Filter "Name = 'dotnet.exe' OR Name = 'Uno_API.exe'" | Where-Object { $_.CommandLine -match "Uno_API" } | ForEach-Object {
    taskkill /PID $_.ProcessId /F /T 2>$null
}
Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Where-Object { $_.CommandLine -match "uno_crm" -or $_.CommandLine -match "Uno_CRM" } | ForEach-Object {
    taskkill /PID $_.ProcessId /F /T 2>$null
}

# Wait a brief moment to ensure ports are freed
Start-Sleep -Seconds 2

Write-Host "Starting UNO ERP Backend (.NET 9 Web API on Port 8001)..." -ForegroundColor Green
Start-Process -FilePath "dotnet" -ArgumentList "run --project .\Uno_API\Uno_API\Uno_API.csproj --launch-profile http"

Write-Host "Starting UNO ERP Frontend (Next.js on Port 8000)..." -ForegroundColor Blue
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd .\Uno_CRM && npm run dev"

Write-Host "Both applications have been launched in new windows!"
Write-Host "API: http://localhost:8001/api/projects"
Write-Host "UI: http://localhost:8000"
