param(
    [string]$Configuration = "Release",
    [string]$PublishProfile = "site84253-WebDeploy",
    [switch]$ApiOnly
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiProject = Join-Path $repoRoot "Uno_API\Uno_API.csproj"

if (-not (Test-Path $apiProject)) {
    throw "API project not found at $apiProject"
}

Write-Host "Publishing Uno_API with profile '$PublishProfile'..."

$publishArgs = @(
    $apiProject
    "-c", $Configuration
    "/p:PublishProfile=$PublishProfile"
)

if ($ApiOnly) {
    Write-Host "API-only publish enabled. Existing wwwroot assets on the server will be left untouched."
    $publishArgs += "/p:ExcludeWwwrootFromPublish=true"
}

dotnet publish @publishArgs
