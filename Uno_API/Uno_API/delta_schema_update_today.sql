-- ============================================================================
-- UNO ERP - Schema & Master Data Delta Upgrade Script
-- Target: Upgrade previous database release to match current db63111 schema
-- Execution Mode: Idempotent (Safe to run multiple times without data loss)
-- ============================================================================

PRINT 'Starting UNO ERP Delta Upgrade Script...';
GO

-- ----------------------------------------------------------------------------
-- 1. TOURS TABLE EXTENSIONS
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Tours]') AND name = 'GuideCommission')
BEGIN
    ALTER TABLE [Tours] ADD [GuideCommission] decimal(18,2) NOT NULL DEFAULT 10.00;
    PRINT 'Added column [Tours].[GuideCommission]';
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Tours]') AND name = 'AccountingClosed')
BEGIN
    ALTER TABLE [Tours] ADD [AccountingClosed] bit NOT NULL DEFAULT 0;
    PRINT 'Added column [Tours].[AccountingClosed]';
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Tours]') AND name = 'Notes')
BEGIN
    ALTER TABLE [Tours] ADD [Notes] nvarchar(max) NULL;
    PRINT 'Added column [Tours].[Notes]';
END;
GO

-- ----------------------------------------------------------------------------
-- 2. PASSENGERS TABLE EXTENSIONS
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Passengers]') AND name = 'RoomNumber')
BEGIN
    ALTER TABLE [Passengers] ADD [RoomNumber] int NULL;
    PRINT 'Added column [Passengers].[RoomNumber]';
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Passengers]') AND name = 'PaxType')
BEGIN
    ALTER TABLE [Passengers] ADD [PaxType] nvarchar(50) NULL;
    PRINT 'Added column [Passengers].[PaxType]';
END;
GO

-- ----------------------------------------------------------------------------
-- 3. TOUR SERVICES TABLE EXTENSIONS
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'ServiceEndDate')
    ALTER TABLE [TourServices] ADD [ServiceEndDate] datetime2 NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'IncludeGuideRoom')
    ALTER TABLE [TourServices] ADD [IncludeGuideRoom] bit NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'IncludeDriverRoom')
    ALTER TABLE [TourServices] ADD [IncludeDriverRoom] bit NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DblEbRate')
    ALTER TABLE [TourServices] ADD [DblEbRate] decimal(18,2) NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DblEbCount')
    ALTER TABLE [TourServices] ADD [DblEbCount] int NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'IsRevenue')
    ALTER TABLE [TourServices] ADD [IsRevenue] bit NOT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DiscountAmount')
    ALTER TABLE [TourServices] ADD [DiscountAmount] decimal(18,2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'DiscountNotes')
    ALTER TABLE [TourServices] ADD [DiscountNotes] nvarchar(max) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[TourServices]') AND name = 'PricingBasis')
    ALTER TABLE [TourServices] ADD [PricingBasis] nvarchar(50) NULL;
PRINT 'Updated [TourServices] schema columns';
GO

-- ----------------------------------------------------------------------------
-- 4. HOTELS TABLE EXTENSIONS
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Hotels]') AND name = 'SingleRoomRate')
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
    PRINT 'Added room and pax rates to [Hotels]';
END;

UPDATE Hotels SET PricingBasis = 'Pax' WHERE PricingBasis IS NULL;
UPDATE Hotels SET ContactName = '' WHERE ContactName IS NULL;
UPDATE Hotels SET ContactRole = '' WHERE ContactRole IS NULL;
UPDATE Hotels SET Email = '' WHERE Email IS NULL;
UPDATE Hotels SET Phone = '' WHERE Phone IS NULL;
UPDATE Hotels SET Location = '' WHERE Location IS NULL;
GO

-- ----------------------------------------------------------------------------
-- 5. NEW TABLES CREATION
-- ----------------------------------------------------------------------------

-- TourAttachments
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TourAttachments')
BEGIN
    CREATE TABLE [TourAttachments] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [TourId] int NOT NULL,
        [FileName] nvarchar(255) NOT NULL,
        [FilePath] nvarchar(500) NOT NULL,
        [FileType] nvarchar(100) NULL,
        [FileSize] bigint NOT NULL DEFAULT 0,
        [Description] nvarchar(500) NULL,
        [UploadedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_TourAttachments] PRIMARY KEY ([Id])
    );
    PRINT 'Created table [TourAttachments]';
END;

-- Users
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
    PRINT 'Created table [Users]';
END;

-- AuditLogs
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
    PRINT 'Created table [AuditLogs]';
END;

-- RolePermissions
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
    PRINT 'Created table [RolePermissions]';
END;

-- TourStatusCheckpoints
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TourStatusCheckpoints')
BEGIN
    CREATE TABLE [TourStatusCheckpoints] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [TargetStatusId] int NOT NULL,
        [CheckpointKey] nvarchar(100) NOT NULL,
        [Name] nvarchar(200) NOT NULL,
        [Description] nvarchar(500) NOT NULL,
        [IsMandatory] bit NOT NULL DEFAULT 1,
        [WarningThresholdDays] int NULL,
        CONSTRAINT [PK_TourStatusCheckpoints] PRIMARY KEY ([Id])
    );
    PRINT 'Created table [TourStatusCheckpoints]';
END;

-- AiKnowledgeItems
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AiKnowledgeItems')
BEGIN
    CREATE TABLE [AiKnowledgeItems] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [Title] nvarchar(255) NOT NULL,
        [Category] nvarchar(100) NOT NULL,
        [Tags] nvarchar(255) NULL,
        [Content] nvarchar(max) NOT NULL,
        [Source] nvarchar(255) NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_AiKnowledgeItems] PRIMARY KEY ([Id])
    );
    PRINT 'Created table [AiKnowledgeItems]';
END;
GO

-- ----------------------------------------------------------------------------
-- 6. SYSTEM DEFAULT DATA & USER SEEDING
-- ----------------------------------------------------------------------------

-- Seed System Users
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'evren@uno-dmc.cz') 
    INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('evren@uno-dmc.cz', 'FenerliDerya@1907', 'Evren', 'Administrator', 1, GETUTCDATE());

IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'gersencelebi@gmail.com') 
    INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('gersencelebi@gmail.com', 'FenerliErsen@1907', 'G. Ersen Çelebi', 'Administrator', 1, GETUTCDATE());

IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'tuana@uno-dmc.cz') 
    INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('tuana@uno-dmc.cz', 'medCezir@1993', 'Tuana', 'TourAdmin', 1, GETUTCDATE());

IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'deniz.evren@uno-dmc.cz') 
    INSERT INTO Users (Email, Password, Name, Role, IsActive, CreatedAt) VALUES ('deniz.evren@uno-dmc.cz', 'FenerliDeniz@1907', 'Deniz Evren', 'Manager', 1, GETUTCDATE());

-- Sync Service Category Names
UPDATE ServiceCategories SET Name = 'Invoiced Fee' WHERE Id = 8;
UPDATE ServiceCategories SET IsActive = 0 WHERE Id = 7;

-- Seed Default AI Role Permissions
IF NOT EXISTS (SELECT * FROM RolePermissions WHERE ScreenKey = 'AI Knowledge Base')
BEGIN
    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Administrator', 'AI Knowledge Base', 1, 1, 1, 1);
    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('TourAdmin', 'AI Knowledge Base', 1, 1, 1, 0);
    INSERT INTO RolePermissions (RoleName, ScreenKey, CanView, CanEntry, CanUpdate, CanDelete) VALUES ('Manager', 'AI Knowledge Base', 1, 0, 0, 0);
END;

PRINT '============================================================================';
PRINT 'UNO ERP Delta Upgrade Script Completed Successfully!';
PRINT '============================================================================';
GO
