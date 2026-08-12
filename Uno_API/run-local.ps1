$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$clientAppDir = Join-Path $repoRoot "Uno_API\ClientApp"
$apiProject = Join-Path $repoRoot "Uno_API\Uno_API.csproj"
$publishDir = Join-Path $repoRoot "Uno_API\bin\Release\net10.0\publish"
$publishedDll = Join-Path $publishDir "Uno_API.dll"
$stopScript = Join-Path $repoRoot "stop-uno-api.ps1"

if (Test-Path $stopScript) {
    & $stopScript -Quiet
}

Write-Host "Building frontend static assets..."
Push-Location $clientAppDir
try {
    npm.cmd run build
}
finally {
    Pop-Location
}

Write-Host "Building API..."
dotnet build $apiProject -c Release --no-restore

Write-Host "Publishing API..."
dotnet publish $apiProject -c Release --no-restore

Write-Host "Starting API on http://localhost:8001 ..."
Push-Location $publishDir
try {
    $env:ASPNETCORE_ENVIRONMENT = "Development"
    $env:ASPNETCORE_URLS = "http://localhost:8001"
    dotnet $publishedDll
}
finally {
    Pop-Location
}
