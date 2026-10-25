using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Uno_API.Models
{
    public class TourExcursionSale
    {
        [Key]
        public int Id { get; set; }

        public int TourId { get; set; }
        public int PassengerId { get; set; }
        public int ExcursionId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        public string PaymentMethod { get; set; } = "Cash EUR"; // "Cash EUR", "Credit Card", "Agency Office"
        public bool IsSettled { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? SettledAt { get; set; }
        public string? SettledBy { get; set; }

        [JsonIgnore]
        public Tour? Tour { get; set; }

        [JsonIgnore]
        public Passenger? Passenger { get; set; }

        [JsonIgnore]
        public Excursion? Excursion { get; set; }
    }
}
