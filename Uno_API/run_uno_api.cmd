@echo off
cd /d C:\Ersen\Projects_2025\Uno_ERP\Uno_API
set ASPNETCORE_ENVIRONMENT=Development
set ASPNETCORE_URLS=http://localhost:8001
set InitializeDatabaseOnStartup=false
set ConnectionStrings__DefaultConnection=Server=(localdb)\MSSQLLocalDB;Database=UnoErpDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;Encrypt=False;Connect Timeout=1
dotnet Uno_API\bin\Release\net10.0\Uno_API.dll 1>C:\Ersen\Projects_2025\Uno_ERP\Uno_API\uno_api_run.log 2>C:\Ersen\Projects_2025\Uno_ERP\Uno_API\uno_api_run.err.log
