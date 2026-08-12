using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uno_API.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        public int TourId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Tour? Tour { get; set; }

        public int ClientId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Client? Client { get; set; }

        public DateTime BookingDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ServiceType { get; set; } = "Tour";

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public ICollection<Collection>? Collections { get; set; }
    }

    public class Collection
    {
        [Key]
        public int Id { get; set; }

        public int BookingId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Booking? Booking { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountPaid { get; set; }

        public DateTime PaymentDate { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string TransactionRef { get; set; } = string.Empty;
    }

    public class SalesTracker
    {
        [Key]
        public int Id { get; set; }

        public int BookingId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Booking? Booking { get; set; }

        public string SalesRepId { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal CommissionRate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal CommissionAmount { get; set; }

        public DateTime Date { get; set; }
    }
}
