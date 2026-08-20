using System.ComponentModel.DataAnnotations;

namespace Uno_API.Models
{
    public class TourAttachment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TourId { get; set; }

        [Required]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string FilePath { get; set; } = string.Empty;

        public string? FileType { get; set; }
        public long FileSize { get; set; }
        public string? Description { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        [System.Text.Json.Serialization.JsonIgnore]
        public Tour? Tour { get; set; }
    }
}
