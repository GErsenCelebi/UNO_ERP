using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Uno_API.Models
{
    public class Passenger
    {
        [Key]
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string NationalId { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string PassportNo { get; set; } = string.Empty;
        public string PassportType { get; set; } = string.Empty;
        public string VisaNo { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        public int Pax { get; set; }

        public int TourId { get; set; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        public Tour? Tour { get; set; }

        [NotMapped]
        public string Name => $"{FirstName} {LastName}".Trim();
    }
}
