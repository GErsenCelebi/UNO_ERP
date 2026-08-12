namespace Uno_API.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string ProjectCode { get; set; } = string.Empty;
        public int ClientId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal ApproxBudget { get; set; }
        public string BaseCurrency { get; set; } = "EUR";
        public int ProjectStatusId { get; set; } = 1;
        public ProjectStatus? ProjectStatus { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public Client? Client { get; set; }
        public ICollection<Tour> Tours { get; set; } = new List<Tour>();
    }
}
