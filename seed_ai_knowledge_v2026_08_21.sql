USE [db63111];
GO

-- Seed Item 1: Release v2026.08.21 Summary
IF NOT EXISTS (SELECT 1 FROM [AiKnowledgeItems] WHERE [QuestionPattern] = 'What is included in Release v2026.08.21?')
BEGIN
    INSERT INTO [AiKnowledgeItems] 
        ([SourceType], [SourceFile], [Category], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES 
        ('ReleaseNotes', 'RELEASE_NOTES_2026_08_21.md', 'Release Notes', 
         'What is included in Release v2026.08.21?', 
         'release, v2026.08.21, features, updates, changelog', 
         'Release v2026.08.21 introduces the interactive AI Copilot Drawer, User Accounts & RBAC role permission matrix, Automated Tour Status Checkpoints, Hotel Multi-Pricing (Single/Double/Twin/Triple rates), Excursion Sales Excel Import, and MSBuild StaticWebAssets deployment fix.', 
         '/settings', 'View User Accounts', 1, GETUTCDATE(), GETUTCDATE());
END
GO

-- Seed Item 2: How to Use AI Copilot
IF NOT EXISTS (SELECT 1 FROM [AiKnowledgeItems] WHERE [QuestionPattern] = 'How to use the AI Copilot Assistant?')
BEGIN
    INSERT INTO [AiKnowledgeItems] 
        ([SourceType], [SourceFile], [Category], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES 
        ('UserGuide', 'SOP-AI-01.md', 'User Guide', 
         'How to use the AI Copilot Assistant?', 
         'ai, chatbot, copilot, help, assistant', 
         'To open the AI Copilot Assistant, click the floating purple ''AI Assistant'' button at the bottom-right corner of any page. You can ask ERP process questions, request active tour summaries, or query governance rules.', 
         '/dashboard', 'Open Dashboard', 1, GETUTCDATE(), GETUTCDATE());
END
GO

-- Seed Item 3: Rule 4 Governance
IF NOT EXISTS (SELECT 1 FROM [AiKnowledgeItems] WHERE [QuestionPattern] = 'What is Rule 4 Governance?')
BEGIN
    INSERT INTO [AiKnowledgeItems] 
        ([SourceType], [SourceFile], [Category], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES 
        ('Governance', 'ERP_Governance_Manual.md', 'Governance Rules', 
         'What is Rule 4 Governance?', 
         'rule 4, finance, accounting, governance, money flows', 
         'Rule 4 dictates strict separation of money flows: Supplier expenses (Hotels, Guides, Transport) must be tracked independently from Client B2B Invoices & Excursion Sales. Base operational fees cannot be mixed with optional passenger excursion revenue.', 
         '/projects', 'Open Projects', 1, GETUTCDATE(), GETUTCDATE());
END
GO

-- Seed Item 4: User Accounts & RBAC
IF NOT EXISTS (SELECT 1 FROM [AiKnowledgeItems] WHERE [QuestionPattern] = 'How to configure user accounts and role access rights?')
BEGIN
    INSERT INTO [AiKnowledgeItems] 
        ([SourceType], [SourceFile], [Category], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES 
        ('UserGuide', 'SOP-ADMIN-02.md', 'Administration', 
         'How to configure user accounts and role access rights?', 
         'users, roles, permissions, rbac, security, admin', 
         'Log in as an Administrator and navigate to User Accounts (/settings). In the User Accounts tab, you can add new users or modify existing user roles (Administrator, TourAdmin, Manager). In the Role Permissions tab, you can set screen access rights (CanView, CanEntry, CanUpdate, CanDelete).', 
         '/settings', 'User Accounts', 1, GETUTCDATE(), GETUTCDATE());
END
GO

-- Seed Item 5: Automated Tour Status Checkpoints
IF NOT EXISTS (SELECT 1 FROM [AiKnowledgeItems] WHERE [QuestionPattern] = 'What are automated tour status checkpoints?')
BEGIN
    INSERT INTO [AiKnowledgeItems] 
        ([SourceType], [SourceFile], [Category], [QuestionPattern], [Keywords], [AnswerMarkdown], [TargetUrl], [ActionLabel], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES 
        ('UserGuide', 'SOP-OPS-03.md', 'Operations', 
         'What are automated tour status checkpoints?', 
         'tours, checkpoints, gatekeeping, workflow, status', 
         'Tours transition through 4 automated checkpoint gates: Proposal (Gate 1 - Project defined), Confirmed (Gate 2 - Hotel vouchers, guide & transport assigned), In Progress (Gate 3 - Arrival date reached & manifest verified), and Completed (Gate 4 - Return date reached & 100% financial audit closed).', 
         '/tours', 'View Tours', 1, GETUTCDATE(), GETUTCDATE());
END
GO
