BEGIN TRANSACTION;
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AiKnowledgeItems')
BEGIN
    CREATE TABLE [AiKnowledgeItems] (
        [Id] int NOT NULL IDENTITY,
        [SourceType] nvarchar(50) NOT NULL,
        [SourceFile] nvarchar(250) NULL,
        [Category] nvarchar(100) NOT NULL,
        [QuestionPattern] nvarchar(500) NOT NULL,
        [Keywords] nvarchar(max) NOT NULL,
        [AnswerMarkdown] nvarchar(max) NOT NULL,
        [TargetUrl] nvarchar(250) NULL,
        [ActionLabel] nvarchar(100) NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_AiKnowledgeItems] PRIMARY KEY ([Id])
    );
END

IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260820165206_AddAiKnowledgeItemsTable')
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260820165206_AddAiKnowledgeItemsTable', N'10.0.9');

COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DblEbCount') ALTER TABLE [TourServices] ADD [DblEbCount] int NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DblEbRate') ALTER TABLE [TourServices] ADD [DblEbRate] decimal(18,2) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DriverEndDate') ALTER TABLE [TourServices] ADD [DriverEndDate] datetime2 NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DriverNights') ALTER TABLE [TourServices] ADD [DriverNights] int NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DriverRate') ALTER TABLE [TourServices] ADD [DriverRate] decimal(18,2) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DriverStartDate') ALTER TABLE [TourServices] ADD [DriverStartDate] datetime2 NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DriverTotal') ALTER TABLE [TourServices] ADD [DriverTotal] decimal(18,2) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'GuideEndDate') ALTER TABLE [TourServices] ADD [GuideEndDate] datetime2 NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'GuideNights') ALTER TABLE [TourServices] ADD [GuideNights] int NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'GuideRate') ALTER TABLE [TourServices] ADD [GuideRate] decimal(18,2) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'GuideStartDate') ALTER TABLE [TourServices] ADD [GuideStartDate] datetime2 NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'GuideTotal') ALTER TABLE [TourServices] ADD [GuideTotal] decimal(18,2) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'IncludeDriverRoom') ALTER TABLE [TourServices] ADD [IncludeDriverRoom] bit NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'IncludeGuideRoom') ALTER TABLE [TourServices] ADD [IncludeGuideRoom] bit NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Hotels]') AND name = 'DblEbPaxRate') ALTER TABLE [Hotels] ADD [DblEbPaxRate] decimal(18,2) NOT NULL DEFAULT 0.0;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Hotels]') AND name = 'DblEbRate') ALTER TABLE [Hotels] ADD [DblEbRate] decimal(18,2) NOT NULL DEFAULT 0.0;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Hotels]') AND name = 'DblEbRoomRate') ALTER TABLE [Hotels] ADD [DblEbRoomRate] decimal(18,2) NOT NULL DEFAULT 0.0;

IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260820171904_AddDblEbAndStaffAccommodationFields')
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260820171904_AddDblEbAndStaffAccommodationFields', N'10.0.9');

COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TourAttachments')
BEGIN
    CREATE TABLE [TourAttachments] (
        [Id] int NOT NULL IDENTITY,
        [TourId] int NOT NULL,
        [FileName] nvarchar(max) NOT NULL,
        [FilePath] nvarchar(max) NOT NULL,
        [FileType] nvarchar(max) NULL,
        [FileSize] bigint NOT NULL,
        [Description] nvarchar(max) NULL,
        [UploadedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_TourAttachments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TourAttachments_Tours_TourId] FOREIGN KEY ([TourId]) REFERENCES [Tours] ([Id]) ON DELETE NO ACTION
    );
    CREATE INDEX [IX_TourAttachments_TourId] ON [TourAttachments] ([TourId]);
END

IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260821162640_Sprint3_FinalUpdates')
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260821162640_Sprint3_FinalUpdates', N'10.0.9');

COMMIT;
GO

BEGIN TRANSACTION;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE [Users] (
        [Id] int NOT NULL IDENTITY,
        [Email] nvarchar(250) NOT NULL,
        [Password] nvarchar(250) NOT NULL,
        [Name] nvarchar(250) NOT NULL,
        [Role] nvarchar(100) NOT NULL DEFAULT 'Administrator',
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
END

IF NOT EXISTS (SELECT * FROM [Users] WHERE [Email] = 'evren@uno-dmc.cz')
    INSERT INTO [Users] ([Email], [Password], [Name], [Role], [IsActive], [CreatedAt]) VALUES ('evren@uno-dmc.cz', 'FenerliDerya@1907', 'Evren', 'Administrator', 1, GETUTCDATE());

IF NOT EXISTS (SELECT * FROM [Users] WHERE [Email] = 'gersencelebi@gmail.com')
    INSERT INTO [Users] ([Email], [Password], [Name], [Role], [IsActive], [CreatedAt]) VALUES ('gersencelebi@gmail.com', 'FenerliErsen@1907', 'G. Ersen Çelebi', 'Administrator', 1, GETUTCDATE());

IF NOT EXISTS (SELECT * FROM [Users] WHERE [Email] = 'tuana@uno-dmc.cz')
    INSERT INTO [Users] ([Email], [Password], [Name], [Role], [IsActive], [CreatedAt]) VALUES ('tuana@uno-dmc.cz', 'medCezir@1993', 'Tuana', 'TourAdmin', 1, GETUTCDATE());

IF NOT EXISTS (SELECT * FROM [Users] WHERE [Email] = 'deniz.evren@uno-dmc.cz')
    INSERT INTO [Users] ([Email], [Password], [Name], [Role], [IsActive], [CreatedAt]) VALUES ('deniz.evren@uno-dmc.cz', 'FenerliDeniz@1907', 'Deniz Evren', 'Manager', 1, GETUTCDATE());

COMMIT;
GO


