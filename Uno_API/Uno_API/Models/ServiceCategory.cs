namespace Uno_API.Models
{
    public class ServiceCategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Expense" or "Revenue"
        public string Classification { get; set; } = "Standard"; // "Standard", "Extra", "Other"
        public bool IsActive { get; set; } = true;

        public bool IsBase { get; set; }
        public bool IsRevenue { get; set; }
        public bool IsOperational { get; set; }
        public bool IsCost { get; set; }
        public bool IsExpandable { get; set; }
    }
}
