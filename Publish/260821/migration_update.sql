BEGIN TRANSACTION;
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

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260820165206_AddAiKnowledgeItemsTable', N'10.0.9');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TourServices] ADD [DblEbCount] int NULL;

ALTER TABLE [TourServices] ADD [DblEbRate] decimal(18,2) NULL;

ALTER TABLE [TourServices] ADD [DriverEndDate] datetime2 NULL;

ALTER TABLE [TourServices] ADD [DriverNights] int NULL;

ALTER TABLE [TourServices] ADD [DriverRate] decimal(18,2) NULL;

ALTER TABLE [TourServices] ADD [DriverStartDate] datetime2 NULL;

ALTER TABLE [TourServices] ADD [DriverTotal] decimal(18,2) NULL;

ALTER TABLE [TourServices] ADD [GuideEndDate] datetime2 NULL;

ALTER TABLE [TourServices] ADD [GuideNights] int NULL;

ALTER TABLE [TourServices] ADD [GuideRate] decimal(18,2) NULL;

ALTER TABLE [TourServices] ADD [GuideStartDate] datetime2 NULL;

ALTER TABLE [TourServices] ADD [GuideTotal] decimal(18,2) NULL;

ALTER TABLE [TourServices] ADD [IncludeDriverRoom] bit NULL;

ALTER TABLE [TourServices] ADD [IncludeGuideRoom] bit NULL;

ALTER TABLE [Hotels] ADD [DblEbPaxRate] decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE [Hotels] ADD [DblEbRate] decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE [Hotels] ADD [DblEbRoomRate] decimal(18,2) NOT NULL DEFAULT 0.0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260820171904_AddDblEbAndStaffAccommodationFields', N'10.0.9');

COMMIT;
GO

BEGIN TRANSACTION;
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

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260821162640_Sprint3_FinalUpdates', N'10.0.9');

COMMIT;
GO

