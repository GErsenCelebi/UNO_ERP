using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Rewrite;
using System.Text.Json.Serialization;
using Uno_API.Data;
using Uno_API.Services;

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

builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<UnoDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null)));

builder.Services.AddScoped<IStorageService, StorageService>();
builder.Services.AddHostedService<StorageMigrationService>();
builder.Services.AddHostedService<KnowledgeBaseWatcherService>();
builder.Services.AddScoped<IKnowledgeRetrievalService, LocalKnowledgeRetrievalService>();
builder.Services.AddScoped<ITourProjectLookupService, TourProjectLookupService>();
builder.Services.AddHttpClient<ILocalLlmService, OllamaLlmService>();

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
        
        var patches = new List<string>
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
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Tours]') AND name = 'Notes') ALTER TABLE [Tours] ADD [Notes] nvarchar(max) NULL;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Passengers]') AND name = 'RoomNumber') ALTER TABLE [Passengers] ADD [RoomNumber] int NULL;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Passengers]') AND name = 'PaxType') ALTER TABLE [Passengers] ADD [PaxType] nvarchar(50) NULL;",
            @"IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TourStatusCheckpoints') CREATE TABLE [TourStatusCheckpoints] ([Id] int IDENTITY(1,1) NOT NULL, [TargetStatusId] int NOT NULL, [CheckpointKey] nvarchar(100) NOT NULL, [Name] nvarchar(200) NOT NULL, [Description] nvarchar(500) NOT NULL, [IsMandatory] bit NOT NULL DEFAULT 1, [WarningThresholdDays] int NULL, CONSTRAINT [PK_TourStatusCheckpoints] PRIMARY KEY ([Id]));",
            @"IF NOT EXISTS (SELECT 1 FROM [TourStatuses]) BEGIN SET IDENTITY_INSERT [TourStatuses] ON; INSERT INTO [TourStatuses] ([Id], [Name], [OrderIndex]) VALUES (1, 'Draft', 1), (2, 'Proposal', 2), (3, 'Confirmed', 3), (4, 'In Progress', 4), (5, 'Completed', 5), (6, 'Cancelled', 6); SET IDENTITY_INSERT [TourStatuses] OFF; END",
            @"IF NOT EXISTS (SELECT 1 FROM [ProjectStatuses]) BEGIN SET IDENTITY_INSERT [ProjectStatuses] ON; INSERT INTO [ProjectStatuses] ([Id], [Name], [OrderIndex]) VALUES (1, 'Draft', 1), (2, 'Planning', 2), (3, 'Active', 3), (4, 'On Hold', 4), (5, 'Completed', 5), (6, 'Cancelled', 6); SET IDENTITY_INSERT [ProjectStatuses] OFF; END",
            @"IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AiKnowledgeItems') CREATE TABLE [AiKnowledgeItems] ([Id] int IDENTITY(1,1) NOT NULL, [SourceType] nvarchar(50) NOT NULL DEFAULT 'DocumentationRepo', [SourceFile] nvarchar(250) NULL, [Category] nvarchar(100) NOT NULL DEFAULT 'General', [SubTopic] nvarchar(100) NULL, [TriggerQueries] nvarchar(max) NULL, [QuestionPattern] nvarchar(500) NOT NULL DEFAULT '', [Keywords] nvarchar(max) NOT NULL DEFAULT '', [AnswerMarkdown] nvarchar(max) NOT NULL DEFAULT '', [TargetUrl] nvarchar(250) NULL, [ActionLabel] nvarchar(100) NULL, [IsActive] bit NOT NULL DEFAULT 1, [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(), [UpdatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(), CONSTRAINT [PK_AiKnowledgeItems] PRIMARY KEY ([Id]));",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[AiKnowledgeItems]') AND name = 'SubTopic') ALTER TABLE [AiKnowledgeItems] ADD [SubTopic] nvarchar(100) NULL;",
            @"IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[AiKnowledgeItems]') AND name = 'TriggerQueries') ALTER TABLE [AiKnowledgeItems] ADD [TriggerQueries] nvarchar(max) NULL;",
            @"IF EXISTS (SELECT * FROM sys.tables WHERE name = 'AiKnowledgeItems') BEGIN UPDATE [AiKnowledgeItems] SET [Keywords] = 'excel, import, project, tour, rooming, sales, master data, scenarios, filename, format' WHERE [Id] IN (268, 328) OR [Keywords] LIKE '%excel%'; END",
            @"UPDATE [Tours] SET [Pax] = [Adults] + [Children] WHERE ([Pax] IS NULL OR [Pax] = 0) AND ([Adults] > 0 OR [Children] > 0);",
            // Baseline CREATE audit logs (idempotent WHERE NOT EXISTS)
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [Timestamp])
              SELECT 2, 'G. Ersen Çelebi', 'gersencelebi@gmail.com', 'Administrator', 'CREATE', 'Project', CAST(p.[Id] AS nvarchar(100)), 'Created project ' + COALESCE(p.[ProjectCode], CAST(p.[Id] AS nvarchar(100))), '2026-08-16 08:30:00'
              FROM [Projects] p
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'Project' AND a.[EntityId] = CAST(p.[Id] AS nvarchar(100)) AND a.[Action] = 'CREATE');",
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [Timestamp])
              SELECT 3, 'Tuana', 'tuana@uno-dmc.cz', 'TourAdmin', 'CREATE', 'Tour', CAST(t.[Id] AS nvarchar(100)), 'Created tour ' + COALESCE(t.[TourCode], CAST(t.[Id] AS nvarchar(100))) + ' (' + COALESCE(t.[Destination], '') + ')', '2026-08-16 09:00:00'
              FROM [Tours] t
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'Tour' AND a.[EntityId] = CAST(t.[Id] AS nvarchar(100)) AND a.[Action] = 'CREATE');",
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [Timestamp])
              SELECT 1, 'Evren', 'evren@uno-dmc.cz', 'Administrator', 'CREATE', 'Hotel', CAST(h.[Id] AS nvarchar(100)), 'Created hotel ' + COALESCE(h.[Name], CAST(h.[Id] AS nvarchar(100))), '2026-06-01 08:00:00'
              FROM [Hotels] h
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'Hotel' AND a.[EntityId] = CAST(h.[Id] AS nvarchar(100)) AND a.[Action] = 'CREATE');",
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [Timestamp])
              SELECT 1, 'Evren', 'evren@uno-dmc.cz', 'Administrator', 'CREATE', 'Guide', CAST(g.[Id] AS nvarchar(100)), 'Created guide ' + COALESCE(g.[Name], CAST(g.[Id] AS nvarchar(100))), '2026-06-01 08:00:00'
              FROM [Guides] g
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'Guide' AND a.[EntityId] = CAST(g.[Id] AS nvarchar(100)) AND a.[Action] = 'CREATE');",
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [Timestamp])
              SELECT 1, 'Evren', 'evren@uno-dmc.cz', 'Administrator', 'CREATE', 'Driver', CAST(d.[Id] AS nvarchar(100)), 'Created driver ' + COALESCE(d.[Name], CAST(d.[Id] AS nvarchar(100))), '2026-06-01 08:00:00'
              FROM [Drivers] d
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'Driver' AND a.[EntityId] = CAST(d.[Id] AS nvarchar(100)) AND a.[Action] = 'CREATE');",
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [Timestamp])
              SELECT 1, 'Evren', 'evren@uno-dmc.cz', 'Administrator', 'CREATE', 'TransportCompany', CAST(tc.[Id] AS nvarchar(100)), 'Created transport company ' + COALESCE(tc.[Name], CAST(tc.[Id] AS nvarchar(100))), '2026-06-01 08:00:00'
              FROM [TransportCompanies] tc
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'TransportCompany' AND a.[EntityId] = CAST(tc.[Id] AS nvarchar(100)) AND a.[Action] = 'CREATE');",
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [Timestamp])
              SELECT 1, 'Evren', 'evren@uno-dmc.cz', 'Administrator', 'CREATE', 'Excursion', CAST(e.[Id] AS nvarchar(100)), 'Created excursion ' + COALESCE(e.[Name], CAST(e.[Id] AS nvarchar(100))), '2026-06-01 08:00:00'
              FROM [Excursions] e
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'Excursion' AND a.[EntityId] = CAST(e.[Id] AS nvarchar(100)) AND a.[Action] = 'CREATE');",
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [Timestamp])
              SELECT 1, 'Evren', 'evren@uno-dmc.cz', 'Administrator', 'CREATE', 'Client', CAST(c.[Id] AS nvarchar(100)), 'Created client ' + COALESCE(c.[Name], CAST(c.[Id] AS nvarchar(100))), '2026-06-01 08:00:00'
              FROM [Clients] c
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'Client' AND a.[EntityId] = CAST(c.[Id] AS nvarchar(100)) AND a.[Action] = 'CREATE');",
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [Timestamp])
              SELECT 1, 'Evren', 'evren@uno-dmc.cz', 'Administrator', 'CREATE', 'ServiceCategory', CAST(sc.[Id] AS nvarchar(100)), 'Created service category ' + COALESCE(sc.[Name], CAST(sc.[Id] AS nvarchar(100))), '2026-06-01 08:00:00'
              FROM [ServiceCategories] sc
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'ServiceCategory' AND a.[EntityId] = CAST(sc.[Id] AS nvarchar(100)) AND a.[Action] = 'CREATE');",
            // TourServices baseline audit logs
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [NewValuesJson], [Timestamp])
              SELECT 3, 'Tuana', 'tuana@uno-dmc.cz', 'TourAdmin', 'CREATE', 'TourService', CAST(ts.[TourId] AS nvarchar(100)), 'Added service ''' + ISNULL(ts.[Description], 'Service #' + CAST(ts.[Id] AS nvarchar(10))) + ''' (Qty: ' + CAST(CAST(ts.[Quantity] AS int) AS nvarchar(10)) + ', Unit: €' + CAST(ts.[UnitPrice] AS nvarchar(20)) + ') to Tour #' + CAST(ts.[TourId] AS nvarchar(10)), '{\""Quantity\"":' + CAST(ts.[Quantity] AS nvarchar(20)) + ',\""UnitPrice\"":' + CAST(ts.[UnitPrice] AS nvarchar(20)) + '}', '2026-08-16 09:15:00'
              FROM [TourServices] ts
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'TourService' AND a.[EntityId] = CAST(ts.[TourId] AS nvarchar(100)) AND a.[Summary] LIKE '%' + ISNULL(ts.[Description], 'Service #' + CAST(ts.[Id] AS nvarchar(10))) + '%');",
            // Bookings baseline audit logs
            @"INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [NewValuesJson], [Timestamp])
              SELECT 3, 'Tuana', 'tuana@uno-dmc.cz', 'TourAdmin', 'CREATE', 'Booking', CAST(b.[TourId] AS nvarchar(100)), 'Created booking ''' + ISNULL(b.[ServiceType], 'Booking #' + CAST(b.[Id] AS nvarchar(10))) + ''' (' + ISNULL(b.[Status], 'Confirmed') + ') for Tour #' + CAST(b.[TourId] AS nvarchar(10)), '{\""Status\"":\""' + ISNULL(b.[Status], 'Confirmed') + '\""}', '2026-08-16 09:20:00'
              FROM [Bookings] b
              WHERE NOT EXISTS (SELECT 1 FROM [AuditLogs] a WHERE a.[EntityName] = 'Booking' AND a.[EntityId] = CAST(b.[TourId] AS nvarchar(100)) AND a.[Summary] LIKE '%' + ISNULL(b.[ServiceType], 'Booking #' + CAST(b.[Id] AS nvarchar(10))) + '%');",
            // TourExcursionSales table
            @"IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TourExcursionSales')
              CREATE TABLE [TourExcursionSales] (
                  [Id] int IDENTITY(1,1) NOT NULL,
                  [TourId] int NOT NULL,
                  [PassengerId] int NOT NULL,
                  [ExcursionId] int NOT NULL,
                  [UnitPrice] decimal(18,2) NOT NULL DEFAULT 0,
                  [PaymentMethod] nvarchar(50) NOT NULL DEFAULT 'Cash EUR',
                  [IsSettled] bit NOT NULL DEFAULT 0,
                  [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
                  [SettledAt] datetime2 NULL,
                  [SettledBy] nvarchar(255) NULL,
                  CONSTRAINT [PK_TourExcursionSales] PRIMARY KEY ([Id])
              );
              IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TourExcursionSales_TourId')
                  CREATE INDEX [IX_TourExcursionSales_TourId] ON [TourExcursionSales] ([TourId]);"
        };

        if (app.Environment.IsDevelopment())
        {
            patches.AddRange(new string[]
            {
                @"UPDATE [Tours] SET [Pax] = 44, [Adults] = 44 WHERE [Id] = 6128 AND ([Pax] IS NULL OR [Pax] = 0);",
                @"UPDATE [AuditLogs] SET [EntityId] = '6114', [Summary] = 'Updated Tour TestTour1 status to Confirmed', [UserId] = 3 WHERE [Id] = 1 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6115', [Summary] = 'Updated Tour TestTour2 status to Confirmed', [UserId] = 3 WHERE [Id] = 2 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6116', [Summary] = 'Updated Tour TestTour3 status to Confirmed', [UserId] = 3 WHERE [Id] = 3 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6117', [Summary] = 'Updated Tour TestTour4 status to Confirmed', [UserId] = 3 WHERE [Id] = 4 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6118', [Summary] = 'Updated Tour TestTour5 status to Confirmed', [UserId] = 3 WHERE [Id] = 5 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6119', [Summary] = 'Updated Tour TestTour6 status to Confirmed', [UserId] = 3 WHERE [Id] = 6 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6120', [Summary] = 'Updated Tour TestTour7 status to Confirmed', [UserId] = 3 WHERE [Id] = 7 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6121', [Summary] = 'Updated Tour TestTour8 status to Confirmed', [UserId] = 3 WHERE [Id] = 8 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6122', [Summary] = 'Updated Tour TestTour9 status to Confirmed', [UserId] = 9 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6123', [Summary] = 'Updated Tour TestTour10 status to Confirmed', [UserId] = 3 WHERE [Id] = 10 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6124', [Summary] = 'Updated Tour TestTour11 status to Confirmed', [UserId] = 3 WHERE [Id] = 11 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6125', [Summary] = 'Updated Tour TestTour12 status to Confirmed', [UserId] = 3 WHERE [Id] = 12 AND [EntityId] = '1';",
                @"UPDATE [AuditLogs] SET [EntityId] = '6128', [Summary] = 'Updated Tour ABCDTEST status to Confirmed', [UserId] = 3 WHERE [Id] = 13 AND [EntityId] = '1';",
                @"IF EXISTS (SELECT 1 FROM [Projects] WHERE [Id] = 6101 AND [ProjectCode] = 'TEST-20260829') AND NOT EXISTS (SELECT 1 FROM [AuditLogs] WHERE [EntityName] = 'Project' AND [EntityId] = '6101' AND [Action] = 'UPDATE')
                    INSERT INTO [AuditLogs] ([UserId], [UserName], [UserEmail], [UserRole], [Action], [EntityName], [EntityId], [Summary], [OldValuesJson], [NewValuesJson], [Timestamp])
                    VALUES (2, 'G. Ersen Çelebi', 'gersencelebi@gmail.com', 'Administrator', 'UPDATE', 'Project', '6101', 'Updated project TEST-20260829 status to Planning', '{\""ProjectStatusId\"":1}', '{\""ProjectStatusId\"":2,\""ApproxBudget\"":45000}', '2026-08-20 14:10:00');",
                @"IF NOT EXISTS (SELECT * FROM Guides WHERE Name LIKE '%Mehmet Y%')
                      INSERT INTO Guides (Name, Language, PhoneNumber, DailyRate) VALUES ('Mehmet Yılmaz', 'Turkish, English', '+905320000001', 120.00);
                  IF EXISTS (SELECT * FROM Tours WHERE Id = 6128) AND NOT EXISTS (SELECT * FROM TourServices WHERE TourId = 6128 AND ServiceCategoryId = 4)
                  BEGIN
                      DECLARE @GuideId INT = (SELECT TOP 1 Id FROM Guides WHERE Name LIKE '%Mehmet Y%' ORDER BY Id);
                      INSERT INTO TourServices (TourId, ServiceCategoryId, GuideId, Description, Quantity, UnitPrice, TotalAmount, IsRevenue)
                      VALUES (6128, 4, @GuideId, 'Guide: Mehmet Yılmaz', 7, 120.00, 840.00, 0);
                  END;
                  IF EXISTS (SELECT * FROM Tours WHERE Id = 6128) AND NOT EXISTS (SELECT * FROM Passengers WHERE TourId = 6128)
                  BEGIN
                      INSERT INTO Passengers (TourId, FirstName, LastName, RoomType, RoomNumber, PaxType, Gender, Pax, NationalId, PassportNo, PassportType, VisaNo, Phone, Address) VALUES
                      (6128, 'Ahmet', 'Yıldız', 'Double', 201, 'Adult', 'Male', 1, '11111111101', 'U12345678', 'Regular', '', '+905321110001', 'Istanbul'),
                      (6128, 'Fatma', 'Yıldız', 'Double', 201, 'Adult', 'Female', 1, '11111111102', 'U12345679', 'Regular', '', '+905321110002', 'Istanbul'),
                      (6128, 'Can', 'Demir', 'Single', 104, 'Adult', 'Male', 1, '11111111103', 'U12345680', 'Regular', '', '+905321110003', 'Ankara'),
                      (6128, 'Elif', 'Demir', 'Triple', 302, 'Children', 'Female', 1, '11111111104', 'U12345681', 'Regular', '', '+905321110004', 'Ankara'),
                      (6128, 'Burak', 'Kaya', 'Double', 205, 'Adult', 'Male', 1, '11111111105', 'U12345682', 'Regular', '', '+905321110005', 'Izmir'),
                      (6128, 'Selin', 'Kaya', 'Double', 205, 'Adult', 'Female', 1, '11111111106', 'U12345683', 'Regular', '', '+905321110006', 'Izmir'),
                      (6128, 'Hasan', 'Arslan', 'Double', 112, 'Adult', 'Male', 1, '11111111107', 'U12345684', 'Regular', '', '+905321110007', 'Bursa'),
                      (6128, 'Merve', 'Çelik', 'Single', 115, 'Adult', 'Female', 1, '11111111108', 'U12345685', 'Regular', '', '+905321110008', 'Antalya'),
                      (6128, 'Oğuz', 'Şen', 'Double', 310, 'Adult', 'Male', 1, '11111111109', 'U12345686', 'Regular', '', '+905321110009', 'Adana'),
                      (6128, 'Zeynep', 'Şen', 'Double', 310, 'Adult', 'Female', 1, '11111111110', 'U12345687', 'Regular', '', '+905321110010', 'Adana');
                      UPDATE Tours SET Pax = 10, Adults = 9, Children = 1, GuideCommission = 10.00 WHERE Id = 6128;
                  END;"
            });
        }

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
    .AddRewrite(@"^_next/data/(.*)/guide/tours/([^/]+)\.txt$", "_next/data/$1/guide/tours/1.txt", skipRemainingRules: true)
    .AddRewrite(@"^_next/data/(.*)/projects/([^/]+)/tours/([^/]+)\.txt$", "_next/data/$1/projects/1/tours/1.txt", skipRemainingRules: true)
    .AddRewrite(@"^_next/data/(.*)/projects/([^/]+)\.txt$", "_next/data/$1/projects/1.txt", skipRemainingRules: true)
    // Initial HTML page loads
    .AddRewrite(@"^dashboard/executive/?$", "dashboard/executive.html", skipRemainingRules: true)
    .AddRewrite(@"^guide/tours/([^/]+)/?$", "guide/tours/1.html", skipRemainingRules: true)
    .AddRewrite(@"^projects/([^/]+)/tours/([^/]+)/?$", "projects/1/tours/1.html", skipRemainingRules: true)
    .AddRewrite(@"^projects/([^/]+)/?$", "projects/1.html", skipRemainingRules: true)
    .AddRewrite(@"^master-data/?$", "master-data.html", skipRemainingRules: true)
    .AddRewrite(@"^tour-calendar/?$", "tour-calendar.html", skipRemainingRules: true)
    .AddRewrite(@"^tours/?$", "tours.html", skipRemainingRules: true)
    .AddRewrite(@"^projects/?$", "projects.html", skipRemainingRules: true)
    .AddRewrite(@"^finance/?$", "finance.html", skipRemainingRules: true)
    .AddRewrite(@"^bookings/?$", "bookings.html", skipRemainingRules: true)
    .AddRewrite(@"^settings/?$", "settings.html", skipRemainingRules: true)
    .AddRewrite(@"^audit-logs/?$", "audit-logs.html", skipRemainingRules: true);
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
