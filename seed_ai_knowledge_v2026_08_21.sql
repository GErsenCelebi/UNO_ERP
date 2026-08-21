USE [db63111];
GO

-- 1. Ensure Table Exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AiKnowledgeItems')
BEGIN
    CREATE TABLE [dbo].[AiKnowledgeItems] (
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
END
GO

-- 2. Seed Items
IF NOT EXISTS (SELECT 1 FROM [AiKnowledgeItems] WHERE [Title] = 'Release v2026.08.21 Summary')
BEGIN
    INSERT INTO [AiKnowledgeItems] ([Title], [Category], [Tags], [Content], [Source], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES ('Release v2026.08.21 Summary', 'Release Notes', 'release, v2026.08.21, features, updates', 'Release v2026.08.21 introduces AI Copilot Drawer, User Accounts & RBAC role permission matrix, Automated Tour Status Checkpoints, Hotel Multi-Pricing (Single/Double/Twin/Triple rates), Excursion Sales Excel Import, and MSBuild StaticWebAssets deployment fix.', 'Release Documentation v2026.08.21', 1, GETUTCDATE(), GETUTCDATE());
END
GO

IF NOT EXISTS (SELECT 1 FROM [AiKnowledgeItems] WHERE [Title] = 'How to Use AI Copilot Assistant')
BEGIN
    INSERT INTO [AiKnowledgeItems] ([Title], [Category], [Tags], [Content], [Source], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES ('How to Use AI Copilot Assistant', 'User Guide', 'ai, chatbot, copilot, help', 'To open the AI Copilot Assistant, click the floating purple ''AI Assistant'' button at the bottom-right corner of any page. You can ask ERP process questions, request active tour summaries, or query governance rules.', 'SOP-AI-01', 1, GETUTCDATE(), GETUTCDATE());
END
GO

IF NOT EXISTS (SELECT 1 FROM [AiKnowledgeItems] WHERE [Title] = 'Rule 4: Separate Money Flows Governance')
BEGIN
    INSERT INTO [AiKnowledgeItems] ([Title], [Category], [Tags], [Content], [Source], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES ('Rule 4: Separate Money Flows Governance', 'Governance Rules', 'rule 4, finance, accounting, governance', 'Rule 4 dictates strict separation of money flows: Supplier expenses (Hotels, Guides, Transport) must be tracked independently from Client B2B Invoices & Excursion Sales. Base operational fees cannot be mixed with optional passenger excursion revenue.', 'ERP Governance Manual', 1, GETUTCDATE(), GETUTCDATE());
END
GO

IF NOT EXISTS (SELECT 1 FROM [AiKnowledgeItems] WHERE [Title] = 'How to Configure User Accounts & Permissions')
BEGIN
    INSERT INTO [AiKnowledgeItems] ([Title], [Category], [Tags], [Content], [Source], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES ('How to Configure User Accounts & Permissions', 'Administration', 'users, roles, permissions, rbac, security', 'Log in as an Administrator and navigate to User Accounts (/settings). In the User Accounts tab, you can add new users or modify existing user roles (Administrator, TourAdmin, Manager). In the Role Permissions tab, you can set screen access rights (CanView, CanEntry, CanUpdate, CanDelete).', 'SOP-ADMIN-02', 1, GETUTCDATE(), GETUTCDATE());
END
GO

IF NOT EXISTS (SELECT 1 FROM [AiKnowledgeItems] WHERE [Title] = 'Automated Tour Status Checkpoints (Gatekeeping)')
BEGIN
    INSERT INTO [AiKnowledgeItems] ([Title], [Category], [Tags], [Content], [Source], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES ('Automated Tour Status Checkpoints (Gatekeeping)', 'Operations', 'tours, checkpoints, gatekeeping, workflow', 'Tours transition through 4 automated checkpoint gates: Proposal (Gate 1 - Project defined), Confirmed (Gate 2 - Hotel vouchers, guide & transport assigned), In Progress (Gate 3 - Arrival date reached & manifest verified), and Completed (Gate 4 - Return date reached & 100% financial audit closed).', 'SOP-OPS-03', 1, GETUTCDATE(), GETUTCDATE());
END
GO
