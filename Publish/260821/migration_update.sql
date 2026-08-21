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

BEGIN TRANSACTION;

IF NOT EXISTS (SELECT * FROM [AiKnowledgeItems] WHERE [QuestionPattern] LIKE '%city tax%')
BEGIN
    INSERT INTO [AiKnowledgeItems] ([SourceType], [SourceFile], [Category], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES (
        'Documentation',
        'tests/e2e/test_hotel_tax.py',
        'Hotel Expenses',
        'How is city tax calculated for hotels? / How does hotel tax work? / Why does city tax show 2 N?',
        'hotel tax, city tax, pax tax, per night, hotel expense, operational service, calculation',
        '### Hotel / City Tax Calculation & Display Behavior' + CHAR(10) + CHAR(10) + '1. **Calculation Formula**:' + CHAR(10) + '   - `Nightly Tax = Total Pax × Tax Rate (€/pax/night)`' + CHAR(10) + '   - `Total Stay Tax = Total Pax × Tax Rate × Number of Nights` ' + CHAR(10) + CHAR(10) + '2. **Table Display Rules**:' + CHAR(10) + '   - Listed directly under **OPERATIONAL SERVICES → Hotel**.' + CHAR(10) + '   - **Description**: `[Hotel Name] (City Tax × [Pax] Pax)`' + CHAR(10) + '   - **QTY**: Displayed as Stay Nights (e.g. `2 N`).' + CHAR(10) + '   - **Unit Price**: `Total Pax × Tax Rate` (e.g. `28 Pax × €2.50 = €70.00`).' + CHAR(10) + '   - **Total**: `Total Stay Tax` (e.g. `€140.00`).',
        '/tour-calendar',
        'View Tour Calendar',
        1,
        GETUTCDATE(),
        GETUTCDATE()
    );
END

IF NOT EXISTS (SELECT * FROM [AiKnowledgeItems] WHERE [QuestionPattern] LIKE '%invoice total amount%')
BEGIN
    INSERT INTO [AiKnowledgeItems] ([SourceType], [SourceFile], [Category], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES (
        'Documentation',
        'tests/e2e/test_invoice_total_amount.py',
        'Invoicing & Billing',
        'How is invoice total amount calculated? / How to update invoice total amount?',
        'invoice, total amount, auto sum, line items, revenue, invoicing',
        '### Invoice Total Amount Auto-Summing Behavior' + CHAR(10) + CHAR(10) + '1. **Automatic Initial Calculation**:' + CHAR(10) + '   - When an invoice is created for a tour, **Total Amount** automatically populates as the sum of all generated line items.' + CHAR(10) + CHAR(10) + '2. **1-Click Auto-Sum Button**:' + CHAR(10) + '   - Click the **`⚡ Auto-Sum From Line Items`** button next to the Total Amount field to instantly recalculate and sync the invoice total whenever line items are modified.',
        '/invoices',
        'View Invoices',
        1,
        GETUTCDATE(),
        GETUTCDATE()
    );
END

IF NOT EXISTS (SELECT * FROM [AiKnowledgeItems] WHERE [QuestionPattern] LIKE '%calendar navigation%')
BEGIN
    INSERT INTO [AiKnowledgeItems] ([SourceType], [SourceFile], [Category], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES (
        'Documentation',
        'tests/e2e/test_tour_calendar_navigation.py',
        'Calendar & Navigation',
        'How does tour calendar navigation work? / Where does the back arrow take me?',
        'calendar, tour calendar, back arrow, project id, navigation',
        '### Tour Navigation & Back Arrow Behavior' + CHAR(10) + CHAR(10) + '1. **Calendar Event Links**:' + CHAR(10) + '   - Clicking a tour on the calendar opens `/projects/[projectId]/tours/[tourId]` using its assigned project ID.' + CHAR(10) + CHAR(10) + '2. **Smart Back Arrow (`←`)**:' + CHAR(10) + '   - Returns to your previous page (e.g., **Tour Calendar** if opened from calendar, or **Project Details** if opened from a project) while preserving scroll position and active filters.',
        '/tour-calendar',
        'View Tour Calendar',
        1,
        GETUTCDATE(),
        GETUTCDATE()
    );
END

COMMIT;
GO



