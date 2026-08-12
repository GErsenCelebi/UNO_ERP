using System.Collections.Generic;

namespace Uno_API.Models
{
    public class TransportCompany
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        
        // Contact Fields
        public string ContactName { get; set; } = string.Empty;
        public string ContactRole { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int FleetSize { get; set; }
        public decimal DailyRate { get; set; }  // Daily rate for the transport company vehicle

        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Driver>? Drivers { get; set; }
    }
}
