-- ============================================================================
-- UNO ERP - Seed 12 Test Tours and Test Project into UnoErpDb
-- Source: db63111
-- Target: UnoErpDb
-- ============================================================================

PRINT 'Starting Test Project & 12 Test Tours Seeding into UnoErpDb...';
GO

-- 1. Ensure Target Client Exists
DECLARE @TargetClientId INT;
SELECT TOP 1 @TargetClientId = Id FROM [UnoErpDb].[dbo].[Clients];
IF @TargetClientId IS NULL SET @TargetClientId = 1;

-- 2. Insert or Get Target Test Project
DECLARE @TargetProjectId INT;
SELECT @TargetProjectId = Id FROM [UnoErpDb].[dbo].[Projects] WHERE ProjectCode = 'TEST-20260829';

IF @TargetProjectId IS NULL
BEGIN
    INSERT INTO [UnoErpDb].[dbo].[Projects] 
        (ProjectCode, ClientId, StartDate, EndDate, Description, ApproxBudget, BaseCurrency, ProjectStatusId)
    VALUES 
        ('TEST-20260829', @TargetClientId, '2026-09-01', '2026-09-30', 'Tests 20260829 (12 Test Tours)', 0, 'EUR', 1);

    SET @TargetProjectId = SCOPE_IDENTITY();
    PRINT 'Created Test Project ID: ' + CAST(@TargetProjectId AS VARCHAR(10));
END
ELSE
BEGIN
    PRINT 'Using Existing Test Project ID: ' + CAST(@TargetProjectId AS VARCHAR(10));
END;

-- 3. Clear existing TestTours in UnoErpDb if any exist to allow clean re-seeding
DELETE FROM [UnoErpDb].[dbo].[Passengers] WHERE TourId IN (SELECT Id FROM [UnoErpDb].[dbo].[Tours] WHERE ProjectId = @TargetProjectId OR TourCode LIKE 'TestTour%');
DELETE FROM [UnoErpDb].[dbo].[Bookings] WHERE TourId IN (SELECT Id FROM [UnoErpDb].[dbo].[Tours] WHERE ProjectId = @TargetProjectId OR TourCode LIKE 'TestTour%');
DELETE FROM [UnoErpDb].[dbo].[TourServices] WHERE TourId IN (SELECT Id FROM [UnoErpDb].[dbo].[Tours] WHERE ProjectId = @TargetProjectId OR TourCode LIKE 'TestTour%');
DELETE FROM [UnoErpDb].[dbo].[TourAttachments] WHERE TourId IN (SELECT Id FROM [UnoErpDb].[dbo].[Tours] WHERE ProjectId = @TargetProjectId OR TourCode LIKE 'TestTour%');
DELETE FROM [UnoErpDb].[dbo].[Tours] WHERE ProjectId = @TargetProjectId OR TourCode LIKE 'TestTour%';

PRINT 'Cleaned previous TestTours in UnoErpDb';
GO

-- 4. Copy 12 TestTours (TestTour1 - TestTour12) from db63111 to UnoErpDb
DECLARE @SrcTourId INT, @TourCode NVARCHAR(100), @Destination NVARCHAR(200), @ArrivalDate DATETIME2, @EndDate DATETIME2;
DECLARE @Adults INT, @Children INT, @Infants INT, @Pax INT, @AdultRate DECIMAL(18,2), @ChildRate DECIMAL(18,2), @InfantRate DECIMAL(18,2);
DECLARE @BaseFee DECIMAL(18,2), @TotalFee DECIMAL(18,2), @GuideCommission DECIMAL(18,2), @ArrivalFlight NVARCHAR(100), @DepartureFlight NVARCHAR(100);
DECLARE @NewTourId INT;

DECLARE tour_cursor CURSOR FOR
SELECT 
    Id, TourCode, Destination, ArrivalDate, EndDate, 
    Adults, Children, Infants, Pax, AdultRate, ChildRate, InfantRate, 
    BaseFee, TotalFee, GuideCommission, ArrivalFlight, DepartureFlight
FROM [db63111].[dbo].[Tours]
WHERE TourCode LIKE 'TestTour%' OR ProjectId = 6103
ORDER BY Id;

OPEN tour_cursor;
FETCH NEXT FROM tour_cursor INTO 
    @SrcTourId, @TourCode, @Destination, @ArrivalDate, @EndDate, 
    @Adults, @Children, @Infants, @Pax, @AdultRate, @ChildRate, @InfantRate, 
    @BaseFee, @TotalFee, @GuideCommission, @ArrivalFlight, @DepartureFlight;

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @TargetProjId INT;
    SELECT TOP 1 @TargetProjId = Id FROM [UnoErpDb].[dbo].[Projects] WHERE ProjectCode = 'TEST-20260829';

    -- Insert Tour with TourStatusId = 1 (First Status on Dashboard: Draft)
    INSERT INTO [UnoErpDb].[dbo].[Tours] (
        ProjectId, TourCode, Destination, ArrivalDate, EndDate, 
        Adults, Children, Infants, Pax, AdultRate, ChildRate, InfantRate, 
        BaseFee, TotalFee, GuideCommission, ArrivalFlight, DepartureFlight, 
        TourStatusId, AccountingClosed, Notes
    ) VALUES (
        @TargetProjId, @TourCode, @Destination, @ArrivalDate, @EndDate, 
        @Adults, @Children, @Infants, @Pax, @AdultRate, @ChildRate, @InfantRate, 
        @BaseFee, @TotalFee, @GuideCommission, @ArrivalFlight, @DepartureFlight, 
        1, 0, 'Seeded from Test Suite (First Dashboard Status)'
    );

    SET @NewTourId = SCOPE_IDENTITY();
    PRINT 'Seeded ' + @TourCode + ' -> New Tour ID: ' + CAST(@NewTourId AS VARCHAR(10));

    -- Copy TourServices for this Tour
    INSERT INTO [UnoErpDb].[dbo].[TourServices] (
        TourId, ServiceCategoryId, Description, Quantity, UnitPrice, TotalAmount, 
        HotelId, DriverId, GuideId, ExcursionId, TransportCompanyId, RoomType, RoomCount, 
        FlightNo, FromAirport, ToAirport, ServiceDate, ServiceEndDate, StartDate, EndDate, 
        TotalNights, DblEbCount, DblEbRate, DriverStartDate, DriverEndDate, DriverNights, DriverRate, DriverTotal, 
        GuideStartDate, GuideEndDate, GuideNights, GuideRate, GuideTotal, 
        IncludeDriverRoom, IncludeGuideRoom, DiscountAmount, DiscountNotes, PricingBasis, IsRevenue
    )
    SELECT 
        @NewTourId, ServiceCategoryId, Description, Quantity, UnitPrice, TotalAmount, 
        HotelId, DriverId, GuideId, ExcursionId, TransportCompanyId, RoomType, RoomCount, 
        FlightNo, FromAirport, ToAirport, ServiceDate, ServiceEndDate, StartDate, EndDate, 
        TotalNights, DblEbCount, DblEbRate, DriverStartDate, DriverEndDate, DriverNights, DriverRate, DriverTotal, 
        GuideStartDate, GuideEndDate, GuideNights, GuideRate, GuideTotal, 
        IncludeDriverRoom, IncludeGuideRoom, DiscountAmount, DiscountNotes, PricingBasis, IsRevenue
    FROM [db63111].[dbo].[TourServices]
    WHERE TourId = @SrcTourId;

    -- Copy Passengers for this Tour
    INSERT INTO [UnoErpDb].[dbo].[Passengers] (
        TourId, FirstName, LastName, PassportNo, DateOfBirth, Gender, Address, Phone, VisaNo, NationalId, PassportType, RoomType, RoomNumber, PaxType
    )
    SELECT 
        @NewTourId, FirstName, LastName, PassportNo, DateOfBirth, Gender, Address, Phone, VisaNo, NationalId, PassportType, RoomType, RoomNumber, PaxType
    FROM [db63111].[dbo].[Passengers]
    WHERE TourId = @SrcTourId;

    -- Copy Bookings for this Tour
    INSERT INTO [UnoErpDb].[dbo].[Bookings] (
        TourId, ClientId, BookingDate, Status, ServiceType, TotalAmount
    )
    SELECT 
        @NewTourId, ClientId, BookingDate, Status, ServiceType, TotalAmount
    FROM [db63111].[dbo].[Bookings]
    WHERE TourId = @SrcTourId;

    FETCH NEXT FROM tour_cursor INTO 
        @SrcTourId, @TourCode, @Destination, @ArrivalDate, @EndDate, 
        @Adults, @Children, @Infants, @Pax, @AdultRate, @ChildRate, @InfantRate, 
        @BaseFee, @TotalFee, @GuideCommission, @ArrivalFlight, @DepartureFlight;
END;

CLOSE tour_cursor;
DEALLOCATE tour_cursor;

PRINT '============================================================================';
PRINT 'Test Project & 12 Test Tours Successfully Seeded into UnoErpDb!';
PRINT '============================================================================';
GO
