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

        // Hotel-specific
        public string? RoomType { get; set; }
        public int? RoomCount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? TotalNights { get; set; }

        public bool? IsRevenue { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public Tour? Tour { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public ServiceCategory? ServiceCategory { get; set; }
    }
}
