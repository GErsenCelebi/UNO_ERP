using System;
using System.Collections.Generic;

namespace Uno_API.Models
{
    public class ExecutiveKpiDashboardDto
    {
        public string Period { get; set; } = "Q3 2026";
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public ExecutiveKpiSummaryDto Summary { get; set; } = new();
        public ExecutiveAiSummaryDto AiSummary { get; set; } = new();
        public List<ExecutiveKpiItemDto> Kpis { get; set; } = new();
        public List<ExecutiveDivergenceDto> DivergenceRadar { get; set; } = new();
        public List<ExecutiveActionItemDto> RecommendedActions { get; set; } = new();
        public List<ExecutiveTourLeagueItemDto> TourLeague { get; set; } = new();
    }

    public class ExecutiveKpiSummaryDto
    {
        public int TotalTours { get; set; }
        public int TotalPax { get; set; }
        public decimal GrossBookingValue { get; set; }
    }

    public class ExecutiveAiSummaryDto
    {
        public string HealthStatus { get; set; } = "Healthy";
        public List<string> BulletPoints { get; set; } = new();
    }

    public class ExecutiveKpiItemDto
    {
        public string Id { get; set; } = string.Empty;
        public int KpiNumber { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Actual { get; set; }
        public decimal Target { get; set; }
        public decimal VariancePct { get; set; }
        public decimal VarianceAbs { get; set; }
        public string RagStatus { get; set; } = "Green"; // "Green", "Amber", "Red"
        public string Unit { get; set; } = "EUR"; // "EUR", "Percentage", "EUR/pax", "EUR/pax/night"
        public string StatusBadge { get; set; } = string.Empty;
        public string FootnoteLabel { get; set; } = string.Empty;
        public string FootnoteValue { get; set; } = string.Empty;
        public decimal AttainmentPct { get; set; }
        public string AccentColor { get; set; } = "emerald"; // "emerald", "blue", "amber", "purple"
    }

    public class ExecutiveDivergenceDto
    {
        public string Metric { get; set; } = string.Empty;
        public decimal VariancePct { get; set; }
        public string Label { get; set; } = string.Empty;
        public decimal Actual { get; set; }
        public decimal Target { get; set; }
        public string Unit { get; set; } = string.Empty;
        public string Color { get; set; } = "emerald"; // "emerald", "blue", "indigo", "amber"
        public int BarWidthPct { get; set; }
    }

    public class ExecutiveActionItemDto
    {
        public string Category { get; set; } = string.Empty; // "Cost Containment", "Revenue Growth", "Cash Flow"
        public string Priority { get; set; } = "High"; // "Priority: High", "Upsell Opportunity", "Liquidity Optimization"
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string BadgeColor { get; set; } = "amber"; // "amber", "blue", "purple"
    }

    public class ExecutiveTourLeagueItemDto
    {
        public int TourId { get; set; }
        public string TourCode { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string DateRange { get; set; } = string.Empty;
        public int Pax { get; set; }
        public decimal TargetRevenue { get; set; }
        public decimal ActualRevenue { get; set; }
        public decimal HotelCostPax { get; set; }
        public string HotelVariance { get; set; } = "0.0%";
        public decimal ExcursionSalesPax { get; set; }
        public decimal TargetMarginPct { get; set; }
        public decimal ActualMarginPct { get; set; }
        public decimal NetProfit { get; set; }
        public string RagStatus { get; set; } = "Green"; // "Green", "Amber", "Red"
        public string StatusText { get; set; } = string.Empty;

        // Level 2 Drill-Down Breakdown (Hierarchical Children)
        public List<ExecutiveServiceBreakdownDto> Services { get; set; } = new();
    }

    public class ExecutiveServiceBreakdownDto
    {
        public string ServiceType { get; set; } = string.Empty; // "Hotel", "Transport", "Guide", "Excursion", "Other"
        public string VendorOrDescription { get; set; } = string.Empty;
        public decimal LineCost { get; set; }
        public decimal CostPerPax { get; set; }
        public decimal LineRevenue { get; set; }
        public string ContractNotes { get; set; } = string.Empty;
    }
}

