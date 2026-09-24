using System;
using System.Collections.Generic;

namespace Uno_API.DTOs
{
    public class TourCalendarEventDTO
    {
        public int TourId { get; set; }
        public int ProjectId { get; set; }
        public string TourCode { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime ArrivalDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Pax { get; set; }
        public string StatusName { get; set; } = string.Empty;
        
        public List<int> AssignedGuideIds { get; set; } = new List<int>();
        public List<string> AssignedGuideNames { get; set; } = new List<string>();
        
        public List<GuideAssignmentDTO> GuideAssignments { get; set; } = new List<GuideAssignmentDTO>();

        public bool HasGuideConflict { get; set; }

        public List<HotelStayDTO> HotelStays { get; set; } = new List<HotelStayDTO>();
        public List<string> Cities { get; set; } = new List<string>();

        public List<string> MissingMainServices { get; set; } = new List<string>();
        public bool HasMissingServices => MissingMainServices != null && MissingMainServices.Count > 0;
    }

    public class HotelStayDTO
    {
        public int HotelId { get; set; }
        public string HotelName { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class GuideAssignmentDTO
    {
        public int GuideId { get; set; }
        public string GuideName { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
