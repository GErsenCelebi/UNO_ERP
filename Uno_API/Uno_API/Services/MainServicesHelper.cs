using System.Collections.Generic;
using System.Linq;
using Uno_API.Models;

namespace Uno_API.Services
{
    public static class MainServicesHelper
    {
        public static List<string> GetMissingMainServices(Tour tour, IEnumerable<TourService>? services)
        {
            var svcList = services?.ToList() ?? new List<TourService>();
            var missing = new List<string>();

            // 1. Guide check
            bool hasGuide = svcList.Any(s => 
                s.GuideId.HasValue || 
                s.ServiceCategoryId == 4 || 
                (s.ServiceCategory != null && s.ServiceCategory.Name.ToLower().Contains("guide")) ||
                (!string.IsNullOrEmpty(s.Description) && s.Description.ToLower().Contains("guide"))
            );
            if (!hasGuide) missing.Add("Guide");

            // 2. Hotel booking check
            bool hasHotel = svcList.Any(s => 
                s.HotelId.HasValue || 
                s.ServiceCategoryId == 1 || 
                (s.ServiceCategory != null && s.ServiceCategory.Name.ToLower().Contains("hotel")) ||
                (!string.IsNullOrEmpty(s.Description) && s.Description.ToLower().Contains("hotel"))
            );
            if (!hasHotel) missing.Add("Hotel booking");

            // 3. Transportation check
            bool hasTransport = svcList.Any(s => 
                s.DriverId.HasValue || 
                s.TransportCompanyId.HasValue || 
                s.ServiceCategoryId == 3 || 
                s.ServiceCategoryId == 5 || 
                (s.ServiceCategory != null && (s.ServiceCategory.Name.ToLower().Contains("transport") || s.ServiceCategory.Name.ToLower().Contains("driver"))) ||
                (!string.IsNullOrEmpty(s.Description) && (s.Description.ToLower().Contains("transport") || s.Description.ToLower().Contains("driver") || s.Description.ToLower().Contains("coach") || s.Description.ToLower().Contains("bus")))
            );
            if (!hasTransport) missing.Add("Transportation");

            // 4. Flight # check
            bool hasFlight = !string.IsNullOrWhiteSpace(tour.ArrivalFlight) || 
                             !string.IsNullOrWhiteSpace(tour.DepartureFlight) || 
                             svcList.Any(s => !string.IsNullOrWhiteSpace(s.FlightNo));
            if (!hasFlight) missing.Add("Flight #");

            return missing;
        }

        public static bool HasMissingMainServices(Tour tour, IEnumerable<TourService>? services)
        {
            return GetMissingMainServices(tour, services).Count > 0;
        }
    }
}
