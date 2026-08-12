namespace Uno_API.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        
        // Contact Fields
        public string ContactName { get; set; } = string.Empty;
        public string ContactRole { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        
        // Navigation Property
        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
