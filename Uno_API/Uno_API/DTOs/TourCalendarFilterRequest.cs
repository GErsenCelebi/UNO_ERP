using System;

namespace Uno_API.DTOs
{
    public class TourCalendarFilterRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int[]? GuideIds { get; set; }
        public int[]? TourStatusIds { get; set; }
        public int[]? ProjectIds { get; set; }
        public string? SearchQuery { get; set; }
        public string? Role { get; set; } // Added for testing RBAC logic, e.g. "Manager" or "Guide"
        public int? CurrentUserId { get; set; } // Added to represent the logged-in user's Id (for Guide filtering)
    }
}
