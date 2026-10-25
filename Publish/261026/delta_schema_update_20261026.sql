-- =========================================================================
-- UNO ERP - Idempotent Production Database Migration Script (2026-10-26)
-- Target Release: masterbranch_20261026
-- Baseline Live Commit: 668e85679fe95debac182dead4bf1e601fc34c77
-- Guarantee: 100% Additive & Non-Destructive (IF NOT EXISTS guards on all DDL)
-- =========================================================================

SET NOCOUNT ON;

-- 1. TourAttachments Table (Storage & Tour File Attachments)
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
END
GO

-- 2. TourExcursionSales Table (On-Tour Guide Excursion Sales Portal)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TourExcursionSales')
BEGIN
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
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TourExcursionSales_TourId')
BEGIN
    CREATE INDEX [IX_TourExcursionSales_TourId] ON [TourExcursionSales] ([TourId]);
END
GO

-- 3. AiKnowledgeItems Structured Columns (SubTopic & TriggerQueries)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AiKnowledgeItems')
BEGIN
    CREATE TABLE [AiKnowledgeItems] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [SourceType] nvarchar(50) NOT NULL DEFAULT 'DocumentationRepo',
        [SourceFile] nvarchar(250) NULL,
        [Category] nvarchar(100) NOT NULL DEFAULT 'General',
        [SubTopic] nvarchar(100) NULL,
        [TriggerQueries] nvarchar(max) NULL,
        [QuestionPattern] nvarchar(500) NOT NULL DEFAULT '',
        [Keywords] nvarchar(max) NOT NULL DEFAULT '',
        [AnswerMarkdown] nvarchar(max) NOT NULL DEFAULT '',
        [TargetUrl] nvarchar(250) NULL,
        [ActionLabel] nvarchar(100) NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_AiKnowledgeItems] PRIMARY KEY ([Id])
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[AiKnowledgeItems]') AND name = 'SubTopic')
    ALTER TABLE [AiKnowledgeItems] ADD [SubTopic] nvarchar(100) NULL;
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[AiKnowledgeItems]') AND name = 'TriggerQueries')
    ALTER TABLE [AiKnowledgeItems] ADD [TriggerQueries] nvarchar(max) NULL;
GO

-- 4. TourServices Discount & Pricing Columns (if not already present)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'DiscountAmount' AND Object_ID = Object_ID(N'TourServices'))
    ALTER TABLE [TourServices] ADD [DiscountAmount] decimal(18,2) NULL;
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'DiscountNotes' AND Object_ID = Object_ID(N'TourServices'))
    ALTER TABLE [TourServices] ADD [DiscountNotes] nvarchar(max) NULL;
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'PricingBasis' AND Object_ID = Object_ID(N'TourServices'))
    ALTER TABLE [TourServices] ADD [PricingBasis] nvarchar(50) NULL;
GO
