namespace Uno_API.Models
{
    public class Driver
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public decimal DailyRate { get; set; }

        public int TransportCompanyId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public TransportCompany? TransportCompany { get; set; }
    }
}
