using System;
using System.Collections.Generic;

namespace Uno_API.Services.ItineraryCopilot
{
    public class ItineraryCopilotPayloadDto
    {
        public int GenerationTimeMs { get; set; }
        public string Currency { get; set; } = "EUR";
        public int TotalPax { get; set; }
        public int TotalRooms { get; set; }
        public int? TourId { get; set; }
        public string Destination { get; set; } = string.Empty;
        public DateTime ArrivalDate { get; set; }
        public DateTime EndDate { get; set; }
        public int DurationDays { get; set; }
        public bool IsNewConceptFromDesignTool { get; set; }
        public string ConceptTheme { get; set; } = string.Empty;
        public string SummaryText { get; set; } = string.Empty;
        public List<ItineraryVariantDto> Variants { get; set; } = new();
        public List<string> AppliedEuRegulations { get; set; } = new();
        public List<string> AvailableActions { get; set; } = new();
    }

    public class ItineraryVariantDto
    {
        public string VariantId { get; set; } = string.Empty; // "variant-3star" or "variant-4star"
        public string VariantName { get; set; } = string.Empty; // "Option A: 3★ Economy Comfort"
        public int StarRating { get; set; } // 3 or 4
        public decimal CostPerPax { get; set; }
        public decimal SellPricePerPax { get; set; }
        public decimal ProjectedMarginPct { get; set; }
        public decimal TotalPackageCost { get; set; }
        public decimal TotalPackageRevenue { get; set; }
        public decimal TotalProfit { get; set; }
        public string QualityTier { get; set; } = string.Empty; // "3-Star Standard" or "4-Star Superior"
        public List<ItineraryHotelStayDto> Hotels { get; set; } = new();
        public List<ItineraryDayDto> Days { get; set; } = new();
        public FinancialBreakdownDto FinancialBreakdown { get; set; } = new();
    }

    public class FinancialBreakdownDto
    {
        public decimal AccommodationsCostPerPax { get; set; }
        public decimal CoachTransportCostPerPax { get; set; }
        public decimal GuideFeesCostPerPax { get; set; }
        public decimal CityTaxesCostPerPax { get; set; }
        public decimal ExcursionsCostPerPax { get; set; }
        public decimal TotalCostPerPax { get; set; }
        public decimal TargetMarginPct { get; set; }
        public decimal SuggestedSellPricePerPax { get; set; }
    }

    public class ItineraryHotelStayDto
    {
        public string City { get; set; } = string.Empty;
        public string HotelName { get; set; } = string.Empty;
        public int StarRating { get; set; }
        public int Nights { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public decimal NightlyRoomRate { get; set; }
        public decimal TotalStayCost { get; set; }
        public string RoomType { get; set; } = "Double/Twin";
        public string MealPlan { get; set; } = "Buffet Breakfast Included";
        public string RateHawkBookingToken { get; set; } = string.Empty;
        public DateTime CancellationDeadline { get; set; }
        public string Provenance { get; set; } = "RateHawk B2B Live API";
    }

    public class ItineraryDayDto
    {
        public int DayNumber { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? TransitLeg { get; set; }
        public double? DrivingHours { get; set; }
        public double? DistanceKm { get; set; }
        public bool MandatoryRestStopInserted { get; set; }
        public string? RestStopLocation { get; set; }
        public string MealsIncluded { get; set; } = "Breakfast";
        public string OvernightCity { get; set; } = string.Empty;
        public List<ItineraryServiceLineDto> Services { get; set; } = new();
    }

    public class ItineraryServiceLineDto
    {
        public string ServiceCategory { get; set; } = string.Empty; // "Hotel", "Transport", "Guide", "Excursion", "City Tax"
        public int ServiceCategoryId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public decimal Quantity { get; set; }
        public decimal TotalAmount { get; set; }
        public bool IsRevenue { get; set; }
        public string SourceProvenance { get; set; } = string.Empty;
    }

    public class ApplyItineraryVariantRequestDto
    {
        public int? TourId { get; set; }
        public int? ProjectId { get; set; }
        public ItineraryVariantDto Variant { get; set; } = new();
        public string? Destination { get; set; }
        public DateTime? ArrivalDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? Pax { get; set; }
        public string? ClientName { get; set; }
        public string? Notes { get; set; }
    }

    public class ApplyItineraryVariantResponseDto
    {
        public bool Success { get; set; }
        public int TourId { get; set; }
        public string TourCode { get; set; } = string.Empty;
        public int ProjectId { get; set; }
        public string RedirectUrl { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public decimal TotalCost { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal MarginPct { get; set; }
        public int CreatedServicesCount { get; set; }
    }

    public class SaveItineraryToProjectRequestDto
    {
        public int ProjectId { get; set; }
        public System.Text.Json.JsonElement Variant { get; set; }
        public string? Destination { get; set; }
        public DateTime? ArrivalDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? Pax { get; set; }
        public string? CustomTitle { get; set; }
        public bool MakePrimary { get; set; } = true;
    }

    public class SaveProjectItineraryResponseDto
    {
        public bool Success { get; set; }
        public int ItineraryId { get; set; }
        public int ProjectId { get; set; }
        public string ProjectCode { get; set; } = string.Empty;
        public string ItineraryCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public decimal SellPricePerPax { get; set; }
        public decimal CostPerPax { get; set; }
        public decimal MarginPct { get; set; }
        public int TotalDays { get; set; }
        public string Message { get; set; } = string.Empty;
        public string RedirectUrl { get; set; } = string.Empty;
    }

    public class CancelHotelBookingsResultDto
    {
        public bool Success { get; set; }
        public int TourId { get; set; }
        public string TourCode { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public int CancelledLinesCount { get; set; }
        public decimal TotalReleasedCost { get; set; }
        public List<CancelledHotelLineDto> CancelledHotels { get; set; } = new();
        public string Message { get; set; } = string.Empty;
        public string AuditSummary { get; set; } = string.Empty;
        public DateTime CancelledAt { get; set; } = DateTime.UtcNow;
        public string CancelledByRole { get; set; } = string.Empty;
    }

    public class CancelledHotelLineDto
    {
        public int ServiceId { get; set; }
        public string HotelName { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public int RoomCount { get; set; }
        public int Nights { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalCost { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
