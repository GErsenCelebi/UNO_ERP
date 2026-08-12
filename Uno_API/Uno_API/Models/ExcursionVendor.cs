using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uno_API.Models
{
    public class ExcursionVendor
    {
        [Key]
        public int Id { get; set; }

        public int ExcursionId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Excursion? Excursion { get; set; }

        public int VendorId { get; set; }
        public Vendor? Vendor { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Cost { get; set; }

        public string Notes { get; set; } = string.Empty;
    }
}
