using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Rewrite;
using System.Text.Json.Serialization;
using Uno_API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var initializeDatabaseOnStartup =
    builder.Configuration.GetValue<bool?>("InitializeDatabaseOnStartup")
    ?? true;

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<UnoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS for Next.js UI
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

if (initializeDatabaseOnStartup)
{
    using (var dbScope = app.Services.CreateScope())
    {
        var db = dbScope.ServiceProvider.GetRequiredService<UnoDbContext>();
        // Make sure database exists
        db.Database.EnsureCreated();
        
        string[] patches = new string[]
        {
            @"IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Tours_Guides_GuideId') ALTER TABLE [Tours] DROP CONSTRAINT [FK_Tours_Guides_GuideId];",
            @"IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TourAttachments') CREATE TABLE [TourAttachments] ([Id] int IDENTITY(1,1) NOT NULL, [TourId] int NOT NULL, [FileName] nvarchar(255) NOT NULL, [FilePath] nvarchar(500) NOT NULL, [FileType] nvarchar(100) NULL, [FileSize] bigint NOT NULL DEFAULT 0, [Description] nvarchar(500) NULL, [UploadedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(), CONSTRAINT [PK_TourAttachments] PRIMARY KEY ([Id]));",
            @"IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tours_GuideId') DROP INDEX [IX_Tours_GuideId] ON [Tours];",
            @"IF EXISTS (SELECT * FROM sys.columns WHERE Name = N'GuideId' AND Object_ID = Object_ID(N'Tours')) ALTER TABLE [Tours] DROP COLUMN [GuideId];",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'ServiceEndDate' AND Object_ID = Object_ID(N'TourServices')) ALTER TABLE [TourServices] ADD [ServiceEndDate] datetime2 NULL;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'IncludeGuideRoom' AND Object_ID = Object_ID(N'TourServices')) ALTER TABLE [TourServices] ADD [IncludeGuideRoom] bit NOT NULL DEFAULT 0;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'IncludeDriverRoom' AND Object_ID = Object_ID(N'TourServices')) ALTER TABLE [TourServices] ADD [IncludeDriverRoom] bit NOT NULL DEFAULT 0;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'DblEbRate' AND Object_ID = Object_ID(N'TourServices')) ALTER TABLE [TourServices] ADD [DblEbRate] decimal(18,2) NOT NULL DEFAULT 0;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'DblEbCount' AND Object_ID = Object_ID(N'TourServices')) ALTER TABLE [TourServices] ADD [DblEbCount] int NOT NULL DEFAULT 0;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'IsRevenue' AND Object_ID = Object_ID(N'TourServices')) ALTER TABLE [TourServices] ADD [IsRevenue] bit NOT NULL DEFAULT 0;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'DiscountAmount' AND Object_ID = Object_ID(N'TourServices')) ALTER TABLE [TourServices] ADD [DiscountAmount] decimal(18,2) NULL;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'DiscountNotes' AND Object_ID = Object_ID(N'TourServices')) ALTER TABLE [TourServices] ADD [DiscountNotes] nvarchar(max) NULL;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'PricingBasis' AND Object_ID = Object_ID(N'TourServices')) ALTER TABLE [TourServices] ADD [PricingBasis] nvarchar(50) NULL;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'SingleRoomRate' AND Object_ID = Object_ID(N'Hotels'))
              BEGIN
                  ALTER TABLE [Hotels] ADD [SingleRoomRate] decimal(18,2) NOT NULL DEFAULT 0;
                  ALTER TABLE [Hotels] ADD [SinglePaxRate] decimal(18,2) NOT NULL DEFAULT 0;
                  ALTER TABLE [Hotels] ADD [DoubleRoomRate] decimal(18,2) NOT NULL DEFAULT 0;
                  ALTER TABLE [Hotels] ADD [DoublePaxRate] decimal(18,2) NOT NULL DEFAULT 0;
                  ALTER TABLE [Hotels] ADD [TwinRoomRate] decimal(18,2) NOT NULL DEFAULT 0;
                  ALTER TABLE [Hotels] ADD [TwinPaxRate] decimal(18,2) NOT NULL DEFAULT 0;
                  ALTER TABLE [Hotels] ADD [TripleRoomRate] decimal(18,2) NOT NULL DEFAULT 0;
                  ALTER TABLE [Hotels] ADD [TriplePaxRate] decimal(18,2) NOT NULL DEFAULT 0;
                  ALTER TABLE [Hotels] ADD [PricingBasis] nvarchar(max) NULL DEFAULT 'Pax';
              END",
            @"UPDATE Hotels SET PricingBasis = 'Pax' WHERE PricingBasis IS NULL; UPDATE Hotels SET ContactName = '' WHERE ContactName IS NULL; UPDATE Hotels SET ContactRole = '' WHERE ContactRole IS NULL; UPDATE Hotels SET Email = '' WHERE Email IS NULL; UPDATE Hotels SET Phone = '' WHERE Phone IS NULL; UPDATE Hotels SET Location = '' WHERE Location IS NULL;",
            @"UPDATE ServiceCategories SET Name = 'Invoiced Fee' WHERE Id = 8; UPDATE ServiceCategories SET IsActive = 0 WHERE Id = 7;",
            @"IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users') CREATE TABLE [Users] ([Id] int IDENTITY(1,1) NOT NULL, [Email] nvarchar(255) NOT NULL, [Password] nvarchar(255) NOT NULL, [Name] nvarchar(255) NOT NULL, [Role] nvarchar(100) NOT NULL DEFAULT 'Administrator', [IsActive] bit NOT NULL DEFAULT 1, [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(), CONSTRAINT [PK_Users] PRIMARY KEY ([Id]));",
            @"IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'evren@uno-dmc.cz') INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('evren@uno-dmc.cz', 'FenerliDerya@1907', 'Evren', 'Administrator', 1, GETUTCDATE());",
            @"IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'gersencelebi@gmail.com') INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('gersencelebi@gmail.com', 'FenerliErsen@1907', 'G. Ersen Çelebi', 'Administrator', 1, GETUTCDATE());",
            @"IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'tuana@uno-dmc.cz') INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('tuana@uno-dmc.cz', 'medCezir@1993', 'Tuana', 'TourAdmin', 1, GETUTCDATE());",
            @"IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'deniz.evren@uno-dmc.cz') INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('deniz.evren@uno-dmc.cz', 'FenerliDeniz@1907', 'Deniz Evren', 'Manager', 1, GETUTCDATE());",
            @"UPDATE Users SET Role = 'Administrator' WHERE Email = 'gersencelebi@gmail.com'; UPDATE Users SET Role = 'TourAdmin' WHERE Email = 'tuana@uno-dmc.cz'; UPDATE Users SET Role = 'Manager' WHERE Email = 'deniz.evren@uno-dmc.cz';",
            @"IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditLogs') CREATE TABLE [AuditLogs] ([Id] int IDENTITY(1,1) NOT NULL, [UserId] int NULL, [UserName] nvarchar(255) NOT NULL DEFAULT '', [UserEmail] nvarchar(255) NOT NULL DEFAULT '', [UserRole] nvarchar(100) NOT NULL DEFAULT '', [Action] nvarchar(50) NOT NULL DEFAULT '', [EntityName] nvarchar(100) NOT NULL DEFAULT '', [EntityId] nvarchar(100) NOT NULL DEFAULT '', [Summary] nvarchar(max) NOT NULL DEFAULT '', [OldValuesJson] nvarchar(max) NULL, [NewValuesJson] nvarchar(max) NULL, [Timestamp] datetime2 NOT NULL DEFAULT GETUTCDATE(), CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id]));",
            @"IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RolePermissions') CREATE TABLE [RolePermissions] ([Id] int IDENTITY(1,1) NOT NULL, [RoleName] nvarchar(100) NOT NULL, [ScreenKey] nvarchar(100) NOT NULL, [CanView] bit NOT NULL DEFAULT 1, [CanEntry] bit NOT NULL DEFAULT 0, [CanUpdate] bit NOT NULL DEFAULT 0, [CanDelete] bit NOT NULL DEFAULT 0, CONSTRAINT [PK_RolePermissions] PRIMARY KEY ([Id]));",
            @"IF NOT EXISTS (SELECT * FROM RolePermissions WHERE ScreenKey = 'AI Knowledge Base') BEGIN INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Administrator', 'AI Knowledge Base', 1, 1, 1, 1); INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('TourAdmin', 'AI Knowledge Base', 1, 1, 1, 0); INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Manager', 'AI Knowledge Base', 1, 0, 0, 0); END",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Tours]') AND name = 'GuideCommission') ALTER TABLE [Tours] ADD [GuideCommission] decimal(18,2) NOT NULL DEFAULT 10.00;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Tours]') AND name = 'AccountingClosed') ALTER TABLE [Tours] ADD [AccountingClosed] bit NOT NULL DEFAULT 0;",
            @"IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TourStatusCheckpoints') CREATE TABLE [TourStatusCheckpoints] ([Id] int IDENTITY(1,1) NOT NULL, [TargetStatusId] int NOT NULL, [CheckpointKey] nvarchar(100) NOT NULL, [Name] nvarchar(200) NOT NULL, [Description] nvarchar(500) NOT NULL, [IsMandatory] bit NOT NULL DEFAULT 1, [WarningThresholdDays] int NULL, CONSTRAINT [PK_TourStatusCheckpoints] PRIMARY KEY ([Id]));",
            @"IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AiKnowledgeItems') CREATE TABLE [AiKnowledgeItems] ([Id] int IDENTITY(1,1) NOT NULL, [Title] nvarchar(255) NOT NULL, [Category] nvarchar(100) NOT NULL, [Tags] nvarchar(255) NULL, [Content] nvarchar(max) NOT NULL, [Source] nvarchar(255) NULL, [IsActive] bit NOT NULL DEFAULT 1, [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(), [UpdatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(), CONSTRAINT [PK_AiKnowledgeItems] PRIMARY KEY ([Id]));"
        };

        foreach (var sql in patches)
        {
            try
            {
                db.Database.ExecuteSqlRaw(sql);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Patch statement exception ignored: " + ex.Message);
            }
        }
    }
    using var scope = app.Services.CreateScope();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");

    try
    {
        var context = scope.ServiceProvider.GetRequiredService<UnoDbContext>();
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database initialization failed during startup.");
    }
}

// Configure the HTTP request pipeline.
app.UseCors("AllowAll");

var options = new RewriteOptions()
    // Next.js RSC Data requests
    .AddRewrite(@"^_next/data/(.*)/projects/([^/]+)/tours/([^/]+)\.txt$", "_next/data/$1/projects/1/tours/1.txt", skipRemainingRules: true)
    .AddRewrite(@"^_next/data/(.*)/projects/([^/]+)\.txt$", "_next/data/$1/projects/1.txt", skipRemainingRules: true)
    // Initial HTML page loads
    .AddRewrite(@"^projects/([^/]+)/tours/([^/]+)/?$", "projects/1/tours/1.html", skipRemainingRules: true)
    .AddRewrite(@"^projects/([^/]+)/?$", "projects/1.html", skipRemainingRules: true);
app.UseRewriter(options);

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();
app.MapOpenApi();
app.MapFallbackToFile("index.html");
app.MapGet("/api/debug-env", (IWebHostEnvironment env) => new {
    ContentRoot = env.ContentRootPath,
    WebRoot = env.WebRootPath,
    WebRootExists = System.IO.Directory.Exists(env.WebRootPath ?? ""),
    WebRootFiles = System.IO.Directory.Exists(env.WebRootPath ?? "") ? System.IO.Directory.GetFiles(env.WebRootPath) : new string[0],
    WebRootDirectories = System.IO.Directory.Exists(env.WebRootPath ?? "") ? System.IO.Directory.GetDirectories(env.WebRootPath) : new string[0],
    CurrentDirectory = System.IO.Directory.GetCurrentDirectory(),
    BaseDirectory = AppContext.BaseDirectory
});

app.Run();
