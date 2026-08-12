namespace Uno_API.Models
{
    public class Guide
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public decimal DailyRate { get; set; }
    }
}
