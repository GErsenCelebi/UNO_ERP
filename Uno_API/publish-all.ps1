param(
    [string]$Configuration = "Release",
    [string]$PublishProfile = "site84253-WebDeploy",
    [string]$Password = "",
    [switch]$ApiOnly
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiProject = Join-Path $repoRoot "Uno_API\Uno_API.csproj"

if (-not (Test-Path $apiProject)) {
    throw "API project not found at $apiProject"
}

if ([string]::IsNullOrWhiteSpace($Password)) {
    $userFile = Join-Path $repoRoot "Uno_API\Properties\PublishProfiles\$PublishProfile.pubxml.user"
    if (Test-Path $userFile) {
        try {
            Add-Type -AssemblyName System.Security
            $xml = [xml](Get-Content $userFile)
            $enc = $xml.Project.PropertyGroup.EncryptedPassword
            if ($enc) {
                $bytes = [System.Convert]::FromBase64String($enc)
                $decBytes = [System.Security.Cryptography.ProtectedData]::Unprotect($bytes, $null, [System.Security.Cryptography.DataProtectionScope]::CurrentUser)
                $Password = [System.Text.Encoding]::Unicode.GetString($decBytes)
                Write-Host "Automatically decrypted WebDeploy password from $userFile"
            }
        } catch {
            Write-Warning "Could not decrypt password: $_"
        }
    }
}

Write-Host "Publishing Uno_API with profile '$PublishProfile'..."

$publishArgs = @(
    $apiProject
    "-c", $Configuration
    "/p:PublishProfile=$PublishProfile"
)

if (-not [string]::IsNullOrWhiteSpace($Password)) {
    $publishArgs += "/p:Password=$Password"
}

if ($ApiOnly) {
    Write-Host "API-only publish enabled. Existing wwwroot assets on the server will be left untouched."
    $publishArgs += "/p:ExcludeWwwrootFromPublish=true"
    $publishArgs += "/p:BuildUnoCrmOnBuild=false"
}

dotnet publish @publishArgs
