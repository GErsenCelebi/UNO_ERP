using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Uno_API.Models
{
    public class Vendor
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        
        // Contact Fields
        public string ContactName { get; set; } = string.Empty;
        public string ContactRole { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ServiceType { get; set; } = string.Empty;

        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<ExcursionVendor>? ExcursionVendors { get; set; }
    }
}
