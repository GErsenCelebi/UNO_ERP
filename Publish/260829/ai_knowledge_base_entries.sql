-- ============================================================================
-- UNO ERP - Delta AI Knowledge Base Entries (Release 2026-08-29)
-- Target Table: [dbo].[AiKnowledgeItems]
-- Content: Delta updates introduced with CHANGES_SUMMARY.md
-- Execution Mode: Idempotent (Safe to run multiple times without duplicates)
-- ============================================================================

PRINT 'Starting Delta AI Knowledge Base Seeding (Release 2026-08-29)...';
GO

-- ----------------------------------------------------------------------------
-- 1. Main Release Summary: CHANGES_SUMMARY.md Overview
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'CHANGES_SUMMARY.md' AND QuestionPattern LIKE '%today''s release%')
BEGIN
    INSERT INTO AiKnowledgeItems (
        SourceType, SourceFile, Category, QuestionPattern, Keywords, 
        AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt
    ) VALUES (
        'ReleaseNotes', 
        'CHANGES_SUMMARY.md', 
        'System Release & Technical Specifications', 
        'What changes were implemented in today''s release (2026-08-29)?', 
        'CHANGES_SUMMARY, Release Notes, 2026-08-29, Guide Commission, Hotel Tax, Draft Status, UnoErpDb', 
        '# 🚀 UNO ERP - Release Summary (2026-08-29)

1. **Guide Commission Calculation**: Strictly derived from Excursion Sales (10%). If zero excursion sales, Guide Commission is strictly €0.00.
2. **Hotel Tax (City Tax)**: All 4 fields (Tax Rate, Total Pax, Nightly Tax, Total Stay Tax) are fully editable inputs. Total Stay Tax manual input takes final saved priority.
3. **Default Tour Workflow Status**: All newly created or imported tours start from the first dashboard status (`TourStatusId = 1` / Draft).
4. **Database Connection**: Switched active local connection string to `UnoErpDb`.
5. **E2E Test Suite**: Generated all 12 Test Tours (`TestTour1` - `TestTour12`) starting at Draft status.', 
        '/tours', 
        'View Tours Dashboard', 
        1, GETUTCDATE(), GETUTCDATE()
    );
    PRINT 'Inserted: CHANGES_SUMMARY.md Release Overview';
END;

-- ----------------------------------------------------------------------------
-- 2. Feature Rule: Guide Commission Calculation
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'CHANGES_SUMMARY.md' AND QuestionPattern LIKE '%guide commission%')
BEGIN
    INSERT INTO AiKnowledgeItems (
        SourceType, SourceFile, Category, QuestionPattern, Keywords, 
        AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt
    ) VALUES (
        'BusinessRule', 
        'CHANGES_SUMMARY.md', 
        'Finance & Commissions', 
        'How is guide commission calculated for a tour?', 
        'Guide Commission, Excursion Sales, 10%, Zero Excursions, Base Services, Services Cost', 
        '### 💶 Guide Commission Calculation Rule
* **Rule**: Guide commission is calculated **strictly based on Excursion Sales** (10% of total excursion sales).
* **Zero Excursions**: If no excursion sales entries exist for a tour (or total excursion sales = 0), **Guide Commission is always €0.00** and no guide commission line item is generated in Base Services / Services Cost.', 
        '/tours', 
        'View Tour Finance Details', 
        1, GETUTCDATE(), GETUTCDATE()
    );
    PRINT 'Inserted: Guide Commission Rule';
END;

-- ----------------------------------------------------------------------------
-- 3. Feature Rule: Hotel Tax (City Tax) 4 Editable Fields & Manual Override
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'CHANGES_SUMMARY.md' AND QuestionPattern LIKE '%Hotel Tax%')
BEGIN
    INSERT INTO AiKnowledgeItems (
        SourceType, SourceFile, Category, QuestionPattern, Keywords, 
        AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt
    ) VALUES (
        'UserInterface', 
        'CHANGES_SUMMARY.md', 
        'Hotel & Accommodation Services', 
        'How do the Hotel Tax (City Tax) editable input fields work?', 
        'Hotel Tax, City Tax, 4 Editable Fields, Tax Rate, Total Pax, Nightly Tax, Total Stay Tax, Manual Override', 
        '### 🏨 Hotel Tax (City Tax) 4 Editable Input Fields
Inside the Hotel Modal (and + City Tax / + Hotel Tax quick action modals), all 4 metrics are rendered as explicit, styled `<input>` fields:
1. **Tax Rate (€ / pax / night)**: Editable `<input>` (e.g. 2.50)
2. **Total Pax**: Editable `<input>` (Defaults to tour pax)
3. **Nightly Tax (€)**: Editable `<input>` (Defaults to Pax × Rate)
4. **Total Stay Tax (€)**: Editable `<input>` (Defaults to Nightly Tax × Nights)

**Manual Override Priority**: Whatever manual value is entered in **Total Stay Tax (€)** is strictly preserved as the final saved service cost amount (`totalAmount`).', 
        '/tours', 
        'Edit Hotel Tax Service', 
        1, GETUTCDATE(), GETUTCDATE()
    );
    PRINT 'Inserted: Hotel Tax Editable Fields Rule';
END;

-- ----------------------------------------------------------------------------
-- 4. Workflow Rule: Default Tour Workflow Status
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'CHANGES_SUMMARY.md' AND QuestionPattern LIKE '%first status%')
BEGIN
    INSERT INTO AiKnowledgeItems (
        SourceType, SourceFile, Category, QuestionPattern, Keywords, 
        AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt
    ) VALUES (
        'Workflow', 
        'CHANGES_SUMMARY.md', 
        'Tour Management & Workflow', 
        'What default status is assigned when a new tour is created or imported?', 
        'Default Tour Status, TourStatusId, Draft, First Dashboard Status, Excel Import', 
        '### 🏁 Default Tour Workflow Status Rule
By default, **every newly created or imported tour starts from the first status on the dashboard** (`TourStatusId = 1` / Draft). Excel rooming imports, manual tour additions, and test script tour creations automatically set the initial status to status ID 1.', 
        '/tours', 
        'View Dashboard Status Columns', 
        1, GETUTCDATE(), GETUTCDATE()
    );
    PRINT 'Inserted: Default Tour Workflow Status Rule';
END;

-- ----------------------------------------------------------------------------
-- 5. Test Suite Specification: 12 Test Tours in UnoErpDb
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM AiKnowledgeItems WHERE SourceFile = 'CHANGES_SUMMARY.md' AND QuestionPattern LIKE '%12 Test Tours%')
BEGIN
    INSERT INTO AiKnowledgeItems (
        SourceType, SourceFile, Category, QuestionPattern, Keywords, 
        AnswerMarkdown, TargetUrl, ActionLabel, IsActive, CreatedAt, UpdatedAt
    ) VALUES (
        'Testing', 
        'CHANGES_SUMMARY.md', 
        'Testing & Automation', 
        'What test tours exist in the database and how were they created?', 
        '12 Test Tours, TestTour1 - TestTour12, E2E Test Suite, Tests 20260829, UnoErpDb', 
        '### 🤖 E2E Test Suite Specification
The E2E Test Suite (`tests/e2e/test_20260829.js`) generated **12 Test Tours (`TestTour1` through `TestTour12`)** under Project `TEST-20260829`:
* **Pax Count**: 30 Pax per tour (27 Adults, 2 Children, 1 Infant) with rooming lists, family groups, room numbers, and child badges.
* **Pricing Modes**: Alternating Pax/Night and Room/Night pricing.
* **Initial Status**: All 12 tours start cleanly at Draft (`TourStatusId = 1`).', 
        '/tours', 
        'View Test Project Tours', 
        1, GETUTCDATE(), GETUTCDATE()
    );
    PRINT 'Inserted: 12 Test Tours Specification';
END;

PRINT '============================================================================';
PRINT 'Delta AI Knowledge Base Seeding (Release 2026-08-29) Completed Successfully!';
PRINT '============================================================================';
GO
