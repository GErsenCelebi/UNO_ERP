using System.ComponentModel.DataAnnotations.Schema;

namespace Uno_API.Models
{
    public class TourService
    {
        public int Id { get; set; }
        public int TourId { get; set; }
        public int ServiceCategoryId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        // Flight details
        public DateTime? ServiceDate { get; set; }
        public DateTime? ServiceEndDate { get; set; }
        public string? FlightNo { get; set; }
        public string? FromAirport { get; set; }
        public string? ToAirport { get; set; }

        // Optional master data FKs
        public int? HotelId { get; set; }
        public int? DriverId { get; set; }
        public int? GuideId { get; set; }
        public int? ExcursionId { get; set; }
        public int? TransportCompanyId { get; set; }

        // Hotel-specific room allocation
        public string? RoomType { get; set; }
        public int? RoomCount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? TotalNights { get; set; }

        // Additional Room Types & Rates
        public int? DblEbCount { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal? DblEbRate { get; set; }

        // Staff Accommodation: Guide
        public bool? IncludeGuideRoom { get; set; }
        public DateTime? GuideStartDate { get; set; }
        public DateTime? GuideEndDate { get; set; }
        public int? GuideNights { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal? GuideRate { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal? GuideTotal { get; set; }

        // Staff Accommodation: Driver
        public bool? IncludeDriverRoom { get; set; }
        public DateTime? DriverStartDate { get; set; }
        public DateTime? DriverEndDate { get; set; }
        public int? DriverNights { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal? DriverRate { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal? DriverTotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountAmount { get; set; }
        public string? DiscountNotes { get; set; }
        public string? PricingBasis { get; set; }

        public bool? IsRevenue { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public Tour? Tour { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public ServiceCategory? ServiceCategory { get; set; }
    }
}
