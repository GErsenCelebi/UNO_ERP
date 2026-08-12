using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uno_API.Models
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int TourId { get; set; }

        public string InvoiceNo { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; } = DateTime.UtcNow;

        // Sender (From) Details
        public string FromCompany { get; set; } = string.Empty;
        public string FromAddress { get; set; } = string.Empty;
        public string FromTel { get; set; } = string.Empty;
        public string FromVAT { get; set; } = string.Empty;

        // Recipient (To) Details
        public string ToCompany { get; set; } = string.Empty;
        public string ToAddress { get; set; } = string.Empty;

        // Boolean toggle for simple view
        public bool IsSimpleView { get; set; } = false;

        // JSON string to hold the dynamic list of invoice lines
        public string LinesJson { get; set; } = "[]";

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public string Currency { get; set; } = "EUR";

        [System.Text.Json.Serialization.JsonIgnore]
        public Tour? Tour { get; set; }
    }
}
