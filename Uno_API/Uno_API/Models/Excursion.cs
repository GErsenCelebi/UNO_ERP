using System.Collections.Generic;

namespace Uno_API.Models
{
    public class Excursion
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal SalePrice { get; set; }
        public string? TourCode { get; set; }

        public int? VendorId { get; set; }
        public Vendor? Vendor { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<ExcursionVendor>? ExcursionVendors { get; set; }
    }
}
