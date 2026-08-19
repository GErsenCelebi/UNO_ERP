namespace Uno_API.Models
{
    public class Tour
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string TourCode { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime ArrivalDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Pax { get; set; }
        public int TourStatusId { get; set; }
        public string? ArrivalFlight { get; set; }
        public string? ArrivalAirport { get; set; }
        public string? DepartureFlight { get; set; }
        public string? DepartureAirport { get; set; }

        public int Adults { get; set; }
        public int Children { get; set; }
        public int Infants { get; set; }
        
        [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "decimal(18,2)")]
        public decimal AdultRate { get; set; }
        [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "decimal(18,2)")]
        public decimal ChildRate { get; set; }
        [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "decimal(18,2)")]
        public decimal InfantRate { get; set; }
        
        [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "decimal(18,2)")]
        public decimal BaseFee { get; set; }
        
        [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "decimal(18,2)")]
        public decimal TotalFee { get; set; }

        [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "decimal(18,2)")]
        public decimal GuideCommission { get; set; } = 10.00m;

        public bool AccountingClosed { get; set; } = false;
        [System.Text.Json.Serialization.JsonIgnore]
        public Project? Project { get; set; }
        public TourStatus? TourStatus { get; set; }
        public ICollection<TourService> TourServices { get; set; } = new List<TourService>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Passenger> Passengers { get; set; } = new List<Passenger>();
        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
}
