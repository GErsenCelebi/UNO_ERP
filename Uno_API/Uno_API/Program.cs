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
    ?? builder.Environment.IsDevelopment();

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
        
        try {
            db.Database.ExecuteSqlRaw(@"
                IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Tours_Guides_GuideId')
                BEGIN
                    ALTER TABLE [Tours] DROP CONSTRAINT [FK_Tours_Guides_GuideId];
                END
                
                IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tours_GuideId')
                BEGIN
                    DROP INDEX [IX_Tours_GuideId] ON [Tours];
                END

                IF EXISTS (SELECT * FROM sys.columns WHERE Name = N'GuideId' AND Object_ID = Object_ID(N'Tours'))
                BEGIN
                    ALTER TABLE [Tours] DROP COLUMN [GuideId];
                END

                IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'ServiceEndDate' AND Object_ID = Object_ID(N'TourServices'))
                BEGIN
                    ALTER TABLE [TourServices] ADD [ServiceEndDate] datetime2 NULL;
                END

                IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'SingleRoomRate' AND Object_ID = Object_ID(N'Hotels'))
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
                END

                UPDATE Hotels SET PricingBasis = 'Pax' WHERE PricingBasis IS NULL;
                UPDATE Hotels SET ContactName = '' WHERE ContactName IS NULL;
                UPDATE Hotels SET ContactRole = '' WHERE ContactRole IS NULL;
                UPDATE Hotels SET Email = '' WHERE Email IS NULL;
                UPDATE Hotels SET Phone = '' WHERE Phone IS NULL;
                UPDATE Hotels SET Location = '' WHERE Location IS NULL;

                UPDATE ServiceCategories SET Name = 'Invoiced Fee' WHERE Id = 8;
                UPDATE ServiceCategories SET IsActive = 0 WHERE Id = 7;

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
                BEGIN
                    CREATE TABLE [Users] (
                        [Id] int IDENTITY(1,1) NOT NULL,
                        [Email] nvarchar(255) NOT NULL,
                        [Password] nvarchar(255) NOT NULL,
                        [Name] nvarchar(255) NOT NULL,
                        [Role] nvarchar(100) NOT NULL DEFAULT 'Administrator',
                        [IsActive] bit NOT NULL DEFAULT 1,
                        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
                        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
                    );
                END

                IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'evren@uno-dmc.cz')
                    INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('evren@uno-dmc.cz', 'FenerliDerya@1907', 'Evren', 'Administrator', 1, GETUTCDATE());
                IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'gersencelebi@gmail.com')
                    INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('gersencelebi@gmail.com', 'FenerliErsen@1907', 'G. Ersen Çelebi', 'Administrator', 1, GETUTCDATE());
                IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'tuana@uno-dmc.cz')
                    INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('tuana@uno-dmc.cz', 'medCezir@1993', 'Tuana', 'TourAdmin', 1, GETUTCDATE());
                IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'deniz.evren@uno-dmc.cz')
                    INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('deniz.evren@uno-dmc.cz', 'FenerliDeniz@1907', 'Deniz Evren', 'Manager', 1, GETUTCDATE());

                UPDATE Users SET Role = 'Administrator' WHERE Email = 'gersencelebi@gmail.com';
                UPDATE Users SET Role = 'TourAdmin' WHERE Email = 'tuana@uno-dmc.cz';
                UPDATE Users SET Role = 'Manager' WHERE Email = 'deniz.evren@uno-dmc.cz';

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditLogs')
                BEGIN
                    CREATE TABLE [AuditLogs] (
                        [Id] int IDENTITY(1,1) NOT NULL,
                        [UserId] int NULL,
                        [UserName] nvarchar(255) NOT NULL DEFAULT '',
                        [UserEmail] nvarchar(255) NOT NULL DEFAULT '',
                        [UserRole] nvarchar(100) NOT NULL DEFAULT '',
                        [Action] nvarchar(50) NOT NULL DEFAULT '',
                        [EntityName] nvarchar(100) NOT NULL DEFAULT '',
                        [EntityId] nvarchar(100) NOT NULL DEFAULT '',
                        [Summary] nvarchar(max) NOT NULL DEFAULT '',
                        [OldValuesJson] nvarchar(max) NULL,
                        [NewValuesJson] nvarchar(max) NULL,
                        [Timestamp] datetime2 NOT NULL DEFAULT GETUTCDATE(),
                        CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id])
                    );
                END

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RolePermissions')
                BEGIN
                    CREATE TABLE [RolePermissions] (
                        [Id] int IDENTITY(1,1) NOT NULL,
                        [RoleName] nvarchar(100) NOT NULL,
                        [ScreenKey] nvarchar(100) NOT NULL,
                        [CanView] bit NOT NULL DEFAULT 1,
                        [CanEntry] bit NOT NULL DEFAULT 0,
                        [CanUpdate] bit NOT NULL DEFAULT 0,
                        [CanDelete] bit NOT NULL DEFAULT 0,
                        CONSTRAINT [PK_RolePermissions] PRIMARY KEY ([Id])
                    );

                    -- Administrator (All permissions)
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Administrator', 'Project', 1, 1, 1, 1);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Administrator', 'Tour', 1, 1, 1, 1);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Administrator', 'Project Overview', 1, 1, 1, 1);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Administrator', 'Project Dashboard', 1, 1, 1, 1);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Administrator', 'Project Finance', 1, 1, 1, 1);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Administrator', 'Master Data', 1, 1, 1, 1);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Administrator', 'Audit Logs', 1, 1, 1, 1);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Administrator', 'User Accounts', 1, 1, 1, 1);

                    -- TourAdmin (As per user example: Tour View/Entry/Update/Delete enabled, Project View & Update enabled)
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('TourAdmin', 'Project', 1, 0, 1, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('TourAdmin', 'Tour', 1, 1, 1, 1);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('TourAdmin', 'Project Overview', 1, 0, 0, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('TourAdmin', 'Project Dashboard', 1, 0, 0, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('TourAdmin', 'Project Finance', 1, 0, 0, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('TourAdmin', 'Master Data', 1, 1, 1, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('TourAdmin', 'Audit Logs', 0, 0, 0, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('TourAdmin', 'User Accounts', 0, 0, 0, 0);

                    -- Manager (Project Entry/Update enabled, Finance View/Entry/Update enabled)
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Manager', 'Project', 1, 1, 1, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Manager', 'Tour', 1, 0, 1, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Manager', 'Project Overview', 1, 0, 0, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Manager', 'Project Dashboard', 1, 0, 0, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Manager', 'Project Finance', 1, 1, 1, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Manager', 'Master Data', 1, 0, 0, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Manager', 'Audit Logs', 1, 0, 0, 0);
                    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Manager', 'User Accounts', 0, 0, 0, 0);
                END
            ");
        } catch (Exception ex) {
            Console.WriteLine("Error executing DB patch: " + ex.Message);
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
