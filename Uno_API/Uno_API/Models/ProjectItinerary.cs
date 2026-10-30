using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Uno_API.Models
{
    public class ProjectItinerary
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(50)]
        public string ItineraryCode { get; set; } = string.Empty;

        [MaxLength(255)]
        public string Destination { get; set; } = string.Empty;

        public int DurationDays { get; set; } = 1;

        public int DurationNights { get; set; } = 0;

        [MaxLength(100)]
        public string Season { get; set; } = "All Year";

        public int TargetPax { get; set; } = 35;

        [Column(TypeName = "decimal(18,2)")]
        public decimal EstimatedCostPerPax { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal EstimatedSellPricePerPax { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TargetMarginPct { get; set; } = 20;

        [MaxLength(50)]
        public string Status { get; set; } = "Draft"; // Draft, Proposed, Active, Confirmed, Archived

        public bool IsPrimary { get; set; } = false;

        public string? Description { get; set; }

        public string? DaysJson { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public Project? Project { get; set; }
    }
}
