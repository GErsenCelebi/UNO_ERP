# UNO ERP E2E Automation Runner PowerShell Wrapper
# Usage:
#   # Run production tests (default):
#   .\tests\e2e\run_prod_tests.ps1
#
#   # Run localhost tests:
#   .\tests\e2e\run_prod_tests.ps1 -Env local
#
#   # Run localhost tests saving into a specific folder:
#   .\tests\e2e\run_prod_tests.ps1 -Env local -RunFolder "20261026_01/results"

param (
    [string]$Env = "prod",
    [string]$RunFolder = ""
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$suiteRunner = Join-Path $scriptDir "run_prod_test_suite.py"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  UNO ERP - Test Automation Suite Launcher" -ForegroundColor Cyan
Write-Host "  Target Environment: $Env" -ForegroundColor Cyan
if ($RunFolder -ne "") {
    Write-Host "  Output Directory:   tests\e2e\test_runs\$RunFolder" -ForegroundColor Cyan
}
Write-Host "============================================================" -ForegroundColor Cyan

$params = @("--env", $Env)
if ($RunFolder -ne "") {
    $params += @("--run-folder", $RunFolder)
}

python $suiteRunner @params

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[PASS] All tests passed successfully." -ForegroundColor Green
} else {
    Write-Host "`n[FAIL] Some tests failed. Please review RUN_REPORT.md in the test run directory." -ForegroundColor Red
}
