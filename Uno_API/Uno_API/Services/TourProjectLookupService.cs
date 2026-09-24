using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Uno_API.Controllers;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Services
{
    public class TourProjectLookupService : ITourProjectLookupService
    {
        private readonly UnoDbContext _context;

        public TourProjectLookupService(UnoDbContext context)
        {
            _context = context;
        }

        public async Task<AIChatResponse?> TryHandleSpecificEntityQueryAsync(string query, string? contextUrl, string? role)
        {
            if (string.IsNullOrWhiteSpace(query)) return null;

            var q = query.Trim().ToLowerInvariant();

            // 1. Try to resolve a specific Tour
            var tour = await ResolveTourEntityAsync(q, contextUrl);
            if (tour != null)
            {
                return await ProcessTourIntentAsync(tour, q);
            }

            // 2. Try to resolve a specific Project
            var project = await ResolveProjectEntityAsync(q, contextUrl);
            if (project != null)
            {
                return await ProcessProjectIntentAsync(project, q);
            }

            return null;
        }

        #region Entity Resolution

        private async Task<Tour?> ResolveTourEntityAsync(string q, string? contextUrl)
        {
            // A. Check for explicit Tour Code matches in the database
            var allTours = await _context.Tours
                .Include(t => t.Project)
                .Include(t => t.TourStatus)
                .ToListAsync();

            // 1. Direct match on TourCode (longest match first to avoid prefix collisions e.g. TestTour1 vs TestTour12)
            foreach (var t in allTours.Where(t => !string.IsNullOrWhiteSpace(t.TourCode)).OrderByDescending(t => t.TourCode.Length))
            {
                var codeLower = t.TourCode.ToLowerInvariant();
                
                // Word boundary or substring match
                if (Regex.IsMatch(q, $@"\b{Regex.Escape(codeLower)}\b", RegexOptions.IgnoreCase) || q.Contains(codeLower))
                {
                    return t;
                }

                // Match with spaces removed: e.g. "tour 1" vs "Tour1"
                var codeNoSpaces = codeLower.Replace(" ", "").Replace("-", "").Replace("_", "");
                var qNoSpaces = q.Replace(" ", "").Replace("-", "").Replace("_", "");
                if (codeNoSpaces.Length >= 4 && qNoSpaces.Contains(codeNoSpaces))
                {
                    return t;
                }
            }

            // 2. Handle patterns like "tour 1", "tour #1", "tour 24", "tour 5"
            var tourNumberMatch = Regex.Match(q, @"\btour\s*#?\s*(\d+)\b", RegexOptions.IgnoreCase);
            if (tourNumberMatch.Success)
            {
                var numStr = tourNumberMatch.Groups[1].Value;
                if (int.TryParse(numStr, out int tourId))
                {
                    var byId = allTours.FirstOrDefault(t => t.Id == tourId);
                    if (byId != null) return byId;

                    var byCode = allTours.FirstOrDefault(t => t.TourCode.Equals($"Tour{tourId}", StringComparison.OrdinalIgnoreCase) ||
                                                             t.TourCode.Equals($"Tour {tourId}", StringComparison.OrdinalIgnoreCase));
                    if (byCode != null) return byCode;
                }
            }

            // 3. Handle acronym or destination snippets (e.g. "BVP", "PVB", "ABCDTEST", "BVP1907")
            var stopWords = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "tour", "tours", "project", "projects", "city", "where", "today", "guide", "hotel", "hotels",
                "margin", "revenue", "cost", "pax", "passenger", "passengers", "manifest", "schedule", "itinerary",
                "which", "what", "show", "tell", "summarize", "summary", "give", "list", "about", "status", "rate",
                "breakdown", "info", "information", "detail", "details", "this", "that", "these", "those"
            };

            var tokenMatches = Regex.Matches(q, @"\b([a-z0-9_-]{3,20})\b", RegexOptions.IgnoreCase);
            foreach (Match m in tokenMatches)
            {
                var token = m.Groups[1].Value.ToLowerInvariant();
                if (stopWords.Contains(token)) continue;

                var candidate = allTours.FirstOrDefault(t => t.TourCode.ToLowerInvariant().Contains(token));
                if (candidate != null) return candidate;
            }

            // B. Context-aware: If user is on a specific Tour page (e.g. /projects/1/tours/5 or /tours/5)
            if (!string.IsNullOrWhiteSpace(contextUrl))
            {
                var routeTourMatch = Regex.Match(contextUrl, @"/tours/(\d+)", RegexOptions.IgnoreCase);
                if (routeTourMatch.Success && int.TryParse(routeTourMatch.Groups[1].Value, out int activeTourId))
                {
                    // Check if query is explicitly asking about ANOTHER specific tour code
                    var otherTour = allTours.FirstOrDefault(t => t.Id != activeTourId && 
                                                                !string.IsNullOrWhiteSpace(t.TourCode) && 
                                                                t.TourCode.Length >= 4 && 
                                                                q.Contains(t.TourCode.ToLowerInvariant()));
                    if (otherTour == null)
                    {
                        // Any question on this tour page that does not specify another tour refers to this active tour!
                        return allTours.FirstOrDefault(t => t.Id == activeTourId);
                    }
                }
            }

            return null;
        }

        private async Task<Project?> ResolveProjectEntityAsync(string q, string? contextUrl)
        {
            var allProjects = await _context.Projects
                .Include(p => p.Client)
                .Include(p => p.ProjectStatus)
                .Include(p => p.Tours)
                .ToListAsync();

            // 1. Direct match on ProjectCode or Description (longest code first)
            foreach (var p in allProjects.OrderByDescending(p => p.ProjectCode?.Length ?? 0))
            {
                var codeLower = p.ProjectCode?.ToLowerInvariant();
                if (!string.IsNullOrEmpty(codeLower))
                {
                    if (q.Contains(codeLower)) return p;

                    // Match separated parts e.g. "Orta Avrupa" from "Orta Avrupa -BVP"
                    var parts = codeLower.Split(new[] { '-', '/', '_' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (var part in parts)
                    {
                        var trimmed = part.Trim();
                        if (trimmed.Length >= 4 && q.Contains(trimmed))
                        {
                            return p;
                        }
                    }
                }

                var descLower = p.Description?.ToLowerInvariant();
                if (!string.IsNullOrEmpty(descLower))
                {
                    if (descLower.Length >= 4 && q.Contains(descLower)) return p;

                    var parts = descLower.Split(new[] { '-', '/', '_' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (var part in parts)
                    {
                        var trimmed = part.Trim();
                        if (trimmed.Length >= 4 && q.Contains(trimmed))
                        {
                            return p;
                        }
                    }
                }
            }

            // 2. Pattern "project 1", "project #1"
            var projMatch = Regex.Match(q, @"\bproject\s*#?\s*(\d+)\b", RegexOptions.IgnoreCase);
            if (projMatch.Success && int.TryParse(projMatch.Groups[1].Value, out int projId))
            {
                var byId = allProjects.FirstOrDefault(p => p.Id == projId);
                if (byId != null) return byId;

                var byCode = allProjects.FirstOrDefault(p => p.ProjectCode.Equals($"Project{projId}", StringComparison.OrdinalIgnoreCase) ||
                                                             p.ProjectCode.Equals($"Project {projId}", StringComparison.OrdinalIgnoreCase));
                if (byCode != null) return byCode;
            }

            // 3. Screen Context match if user is on /projects/1 (and not on a nested /tours/ page)
            if (!string.IsNullOrWhiteSpace(contextUrl))
            {
                var routeProjMatch = Regex.Match(contextUrl, @"/projects/(\d+)", RegexOptions.IgnoreCase);
                if (routeProjMatch.Success && int.TryParse(routeProjMatch.Groups[1].Value, out int activeProjId))
                {
                    if (!contextUrl.Contains("/tours/"))
                    {
                        var otherProj = allProjects.FirstOrDefault(p => p.Id != activeProjId &&
                                                                       !string.IsNullOrWhiteSpace(p.ProjectCode) &&
                                                                       p.ProjectCode.Length >= 4 &&
                                                                       q.Contains(p.ProjectCode.ToLowerInvariant()));
                        if (otherProj == null)
                        {
                            return allProjects.FirstOrDefault(p => p.Id == activeProjId);
                        }
                    }
                }
            }

            return null;
        }

        #endregion

        #region Tour Intent Processing

        private async Task<AIChatResponse> ProcessTourIntentAsync(Tour tour, string q)
        {
            var tourServices = await _context.TourServices
                .Include(s => s.ServiceCategory)
                .Where(s => s.TourId == tour.Id)
                .ToListAsync();

            var hotels = await _context.Hotels.ToListAsync();
            var guides = await _context.Guides.ToListAsync();
            var drivers = await _context.Drivers.ToListAsync();
            var transportCos = await _context.TransportCompanies.ToListAsync();

            // 1. Current City / Location / Schedule / Today
            if (q.Contains("city") || q.Contains("where") || q.Contains("today") || q.Contains("location") || q.Contains("itinerary") || q.Contains("schedule"))
            {
                return HandleTourLocation(tour, tourServices, hotels, guides);
            }

            // 2. Guide / Personnel / Driver
            if (q.Contains("guide") || q.Contains("driver") || q.Contains("bus") || q.Contains("transport") || q.Contains("leader") || q.Contains("who"))
            {
                return HandleTourPersonnel(tour, tourServices, guides, drivers, transportCos);
            }

            // 3. Hotel Stays & Accommodation
            if (q.Contains("hotel") || q.Contains("stay") || q.Contains("room") || q.Contains("accommodation") || q.Contains("night"))
            {
                return HandleTourHotels(tour, tourServices, hotels);
            }

            // 4. Financials & Profit Margin
            if (q.Contains("margin") || q.Contains("revenue") || q.Contains("profit") || q.Contains("cost") || q.Contains("expense") || q.Contains("financial") || q.Contains("commission") || q.Contains("fee"))
            {
                return HandleTourFinancials(tour, tourServices);
            }

            // 5. Passengers & Rooming Manifest
            if (q.Contains("pax") || q.Contains("passenger") || q.Contains("people") || q.Contains("manifest") || q.Contains("adult") || q.Contains("child") || q.Contains("infant"))
            {
                return await HandleTourPassengersAsync(tour);
            }

            // 6. Actionable Operational Advisory & "How to Proceed" / Missing Services Check
            if (q.Contains("proceed") || q.Contains("next") || q.Contains("missing") || q.Contains("action") || 
                q.Contains("advise") || q.Contains("advice") || q.Contains("recommend") || q.Contains("critical") || 
                q.Contains("suggestion") || q.Contains("checklist") || q.Contains("what should") || q.Contains("what to do") ||
                q.Contains("require") || q.Contains("situation") || q.Contains("readiness") || q.Contains("to do") ||
                q.Contains("needed") || q.Contains("pending") || q.Contains("alert") || q.Contains("risk") ||
                q.Contains("complete") || q.Contains("warn") || q.Contains("urgency") || q.Contains("how to"))
            {
                return HandleTourAdvisoryAndNextSteps(tour, tourServices, hotels, guides, drivers, transportCos);
            }

            // 7. Gate Checkpoint Readiness
            if (q.Contains("checkpoint") || q.Contains("gate") || q.Contains("advance") || q.Contains("lockdown"))
            {
                return HandleTourStatus(tour, tourServices);
            }

            // 8. Status, Health & Progress ("how is this tour going", "progress", "update", "doing", "health", "overview")
            if (q.Contains("status") || q.Contains("going") || q.Contains("progress") || q.Contains("update") || 
                q.Contains("doing") || q.Contains("how is") || q.Contains("how does") || q.Contains("health") || 
                q.Contains("briefing") || q.Contains("overview") || q.Contains("ready"))
            {
                return HandleTourProgressSummary(tour, tourServices, hotels, guides);
            }

            // Default: Full Master Operational Briefing Card
            return HandleTourMasterCard(tour, tourServices, hotels, guides);
        }

        private AIChatResponse HandleTourLocation(Tour tour, List<TourService> services, List<Hotel> hotels, List<Guide> guides)
        {
            var today = DateTime.Today;
            var response = new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup"
            };

            var hotelStays = services
                .Where(s => s.HotelId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Hotel", StringComparison.OrdinalIgnoreCase)))
                .OrderBy(s => s.StartDate ?? tour.ArrivalDate)
                .ToList();

            var guideService = services.FirstOrDefault(s => s.GuideId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Guide", StringComparison.OrdinalIgnoreCase)));
            var guideName = "Not Assigned";
            if (guideService?.GuideId != null)
            {
                var g = guides.FirstOrDefault(x => x.Id == guideService.GuideId);
                if (g != null) guideName = g.Name;
            }

            string currentCityStatus;
            int totalNights = Math.Max(1, (int)(tour.EndDate.Date - tour.ArrivalDate.Date).TotalDays);

            if (today < tour.ArrivalDate.Date)
            {
                var daysUntil = (int)(tour.ArrivalDate.Date - today).TotalDays;
                var startCity = ExtractStartingCity(tour.Destination);
                currentCityStatus = $"⏳ **Upcoming Departure**: The tour departs in **{daysUntil} days** on `{tour.ArrivalDate:dd/MM/yyyy}` starting in **{startCity}**.";
            }
            else if (today > tour.EndDate.Date)
            {
                var endCity = ExtractEndingCity(tour.Destination);
                currentCityStatus = $"🏁 **Tour Concluded**: The tour finished on `{tour.EndDate:dd/MM/yyyy}` in **{endCity}**.";
            }
            else
            {
                // Active Today!
                int dayNumber = (int)(today - tour.ArrivalDate.Date).TotalDays + 1;
                
                // Find active hotel stay
                var activeStay = hotelStays.FirstOrDefault(s => 
                    s.StartDate.HasValue && s.EndDate.HasValue && 
                    s.StartDate.Value.Date <= today && today < s.EndDate.Value.Date);

                string activeCity = "Central Europe Route";
                string activeHotelName = "Assigned Group Hotel";

                if (activeStay != null && activeStay.HotelId.HasValue)
                {
                    var h = hotels.FirstOrDefault(x => x.Id == activeStay.HotelId);
                    if (h != null)
                    {
                        activeCity = !string.IsNullOrEmpty(h.Location) ? h.Location : h.Name;
                        activeHotelName = h.Name;
                    }
                }
                else
                {
                    activeCity = EstimateCityFromRoute(tour.Destination, dayNumber, totalNights);
                }

                currentCityStatus = $"📍 **Current Location Today**: 🏙️ **{activeCity}** *(Day {dayNumber} of {totalNights + 1})*\n" +
                                    $"• **Active Hotel**: `{activeHotelName}`\n" +
                                    $"• **Primary Guide on Duty**: `{guideName}`";
            }

            // Build Day-by-Day Hotel / City Schedule
            var scheduleList = new List<string>();
            if (hotelStays.Count > 0)
            {
                int step = 1;
                foreach (var stay in hotelStays)
                {
                    var h = stay.HotelId.HasValue ? hotels.FirstOrDefault(x => x.Id == stay.HotelId) : null;
                    var hName = h?.Name ?? stay.Description ?? "Hotel Accommodation";
                    var hLoc = h?.Location ?? "En Route";
                    var sDate = stay.StartDate ?? tour.ArrivalDate;
                    var eDate = stay.EndDate ?? sDate.AddDays(stay.TotalNights ?? 1);
                    var nights = stay.TotalNights ?? Math.Max(1, (int)(eDate - sDate).TotalDays);

                    scheduleList.Add($"   {step++}. **{hLoc}**: `{hName}` — {sDate:dd/MM} to {eDate:dd/MM} ({nights} nights)");
                }
            }
            else
            {
                var routeCities = SplitRouteCities(tour.Destination);
                for (int i = 0; i < routeCities.Count; i++)
                {
                    scheduleList.Add($"   {i + 1}. **{routeCities[i]}**: Standard Tour Itinerary Stop");
                }
            }

            response.Answer = $"👋 **Live Location & Itinerary for Tour `{tour.TourCode}`**:\n\n" +
                $"{currentCityStatus}\n\n" +
                $"• **Destination Route**: `{tour.Destination}`\n" +
                $"• **Tour Duration**: `{tour.ArrivalDate:dd/MM/yyyy}` ➔ `{tour.EndDate:dd/MM/yyyy}` ({totalNights} Nights / {totalNights + 1} Days)\n" +
                $"• **Flight Manifest**: Arrival `{tour.ArrivalFlight ?? "Not set"}` ({tour.ArrivalAirport ?? "—"}) | Departure `{tour.DepartureFlight ?? "Not set"}` ({tour.DepartureAirport ?? "—"})\n\n" +
                $"📅 **Complete City & Hotel Schedule**:\n" +
                string.Join("\n", scheduleList);

            response.RecommendedLinks = new List<QuickActionLink>
            {
                new QuickActionLink { Label = $"Open {tour.TourCode} Operations", Path = $"/projects/{tour.ProjectId}/tours/{tour.Id}" }
            };

            response.SuggestedPills = new List<string>
            {
                $"Who is the guide for {tour.TourCode}?",
                $"Show hotel breakdown for {tour.TourCode}",
                $"What is the margin for {tour.TourCode}?",
                $"Passenger manifest for {tour.TourCode}"
            };

            return response;
        }

        private AIChatResponse HandleTourPersonnel(Tour tour, List<TourService> services, List<Guide> guides, List<Driver> drivers, List<TransportCompany> transportCos)
        {
            var guideService = services.FirstOrDefault(s => s.GuideId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Guide", StringComparison.OrdinalIgnoreCase)));
            var driverService = services.FirstOrDefault(s => s.DriverId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Driver", StringComparison.OrdinalIgnoreCase)));
            var transportService = services.FirstOrDefault(s => s.TransportCompanyId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Transport", StringComparison.OrdinalIgnoreCase)));

            string guideInfo = "⚠️ *No primary guide assigned yet.*";
            if (guideService?.GuideId != null)
            {
                var g = guides.FirstOrDefault(x => x.Id == guideService.GuideId);
                if (g != null)
                {
                    guideInfo = $"👤 **{g.Name}**\n" +
                                $"   • **Languages**: `{g.Language ?? "English"}`\n" +
                                $"   • **Phone**: `{g.PhoneNumber ?? "On file"}`\n" +
                                $"   • **Daily Rate**: `€{g.DailyRate:N2}`\n" +
                                $"   • **Service Total Cost**: `€{guideService.TotalAmount:N2}`";
                }
            }

            string driverInfo = "⚠️ *No driver assigned yet.*";
            if (driverService?.DriverId != null)
            {
                var d = drivers.FirstOrDefault(x => x.Id == driverService.DriverId);
                if (d != null)
                {
                    driverInfo = $"🚌 **{d.Name}** (Phone: `{d.PhoneNumber ?? "On file"}` | Rate: `€{d.DailyRate:N2}/day`)";
                }
            }

            string transportInfo = "⚠️ *No transport company contracted.*";
            if (transportService?.TransportCompanyId != null)
            {
                var tc = transportCos.FirstOrDefault(x => x.Id == transportService.TransportCompanyId);
                if (tc != null)
                {
                    transportInfo = $"🏢 **{tc.Name}** (Rate: `€{tc.DailyRate:N2}/day`)";
                }
            }

            var response = new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = $"👋 **Assigned Personnel for Tour `{tour.TourCode}`**:\n\n" +
                         $"### 🧭 Tour Guide Assignment\n{guideInfo}\n\n" +
                         $"### 🚌 Transportation & Driver\n" +
                         $"• **Assigned Driver**: {driverInfo}\n" +
                         $"• **Transport Provider**: {transportInfo}\n\n" +
                         $"• **Excursion Guide Commission**: `{tour.GuideCommission}%` on all optional excursion cash sales.",
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = "Manage Personnel in Services", Path = $"/projects/{tour.ProjectId}/tours/{tour.Id}" }
                },
                SuggestedPills = new List<string>
                {
                    $"In which city is {tour.TourCode} today?",
                    $"Hotel stays for {tour.TourCode}",
                    $"What is the margin for {tour.TourCode}?",
                    "Tour status transition criteria"
                }
            };

            return response;
        }

        private AIChatResponse HandleTourHotels(Tour tour, List<TourService> services, List<Hotel> hotels)
        {
            var hotelStays = services
                .Where(s => s.HotelId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Hotel", StringComparison.OrdinalIgnoreCase)))
                .OrderBy(s => s.StartDate ?? tour.ArrivalDate)
                .ToList();

            var totalHotelExpense = hotelStays.Sum(s => s.TotalAmount);
            var hotelLines = new List<string>();

            if (hotelStays.Count == 0)
            {
                hotelLines.Add("⚠️ *No hotel reservations currently registered under Services tab.*");
            }
            else
            {
                int index = 1;
                foreach (var stay in hotelStays)
                {
                    var h = stay.HotelId.HasValue ? hotels.FirstOrDefault(x => x.Id == stay.HotelId) : null;
                    var name = h?.Name ?? stay.Description ?? "Hotel Stay";
                    var loc = h?.Location ?? "Central Europe";
                    var stars = h != null && h.StarRating > 0 ? $"{h.StarRating}★" : "4★";
                    var sDate = stay.StartDate ?? tour.ArrivalDate;
                    var eDate = stay.EndDate ?? sDate.AddDays(stay.TotalNights ?? 1);
                    var nights = stay.TotalNights ?? Math.Max(1, (int)(eDate - sDate).TotalDays);

                    hotelLines.Add($"**{index++}. {name} ({stars})** — 📍 `{loc}`\n" +
                                   $"   • **Dates**: `{sDate:dd/MM/yyyy}` to `{eDate:dd/MM/yyyy}` ({nights} nights)\n" +
                                   $"   • **Rooms**: `{stay.RoomCount ?? 0}` {stay.RoomType ?? "Rooms"} (Rate: `€{stay.UnitPrice:N2}`)\n" +
                                   $"   • **Total Stay Cost**: `€{stay.TotalAmount:N2}`");
                }
            }

            var response = new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = $"👋 **Hotel Stays & Accommodations for Tour `{tour.TourCode}`**:\n\n" +
                         $"• **Destination Route**: `{tour.Destination}`\n" +
                         $"• **Combined Hotel Cost**: `€{totalHotelExpense:N2}`\n\n" +
                         $"### 🏨 Contracted Hotel Reservations\n" +
                         string.Join("\n\n", hotelLines),
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = "View Hotel Services", Path = $"/projects/{tour.ProjectId}/tours/{tour.Id}" }
                },
                SuggestedPills = new List<string>
                {
                    $"In which city is {tour.TourCode} today?",
                    $"Who is the guide for {tour.TourCode}?",
                    $"What is the margin for {tour.TourCode}?",
                    "How is hotel cost calculated?"
                }
            };

            return response;
        }

        private AIChatResponse HandleTourFinancials(Tour tour, List<TourService> services)
        {
            var grossRevenue = tour.TotalFee > 0 ? tour.TotalFee : tour.BaseFee;
            var totalExpenses = services.Where(s => s.IsRevenue != true).Sum(s => s.TotalAmount);
            var netMargin = grossRevenue - totalExpenses;
            var marginPercent = grossRevenue > 0 ? (netMargin / grossRevenue) * 100 : 0;

            var hotelCosts = services.Where(s => s.HotelId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Hotel", StringComparison.OrdinalIgnoreCase))).Sum(s => s.TotalAmount);
            var guideCosts = services.Where(s => s.GuideId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Guide", StringComparison.OrdinalIgnoreCase))).Sum(s => s.TotalAmount);
            var transportCosts = services.Where(s => s.DriverId.HasValue || s.TransportCompanyId.HasValue || (s.ServiceCategory != null && (s.ServiceCategory.Name.Equals("Transport", StringComparison.OrdinalIgnoreCase) || s.ServiceCategory.Name.Equals("Driver", StringComparison.OrdinalIgnoreCase)))).Sum(s => s.TotalAmount);
            var otherCosts = totalExpenses - (hotelCosts + guideCosts + transportCosts);

            string healthEmoji = marginPercent >= 20 ? "🟢 Healthy Profit" : (marginPercent >= 10 ? "🟡 Moderate Margin" : "🔴 Tight Margin / Review Costs");

            var response = new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = $"👋 **Financial & Profit Margin Breakdown for Tour `{tour.TourCode}`**:\n\n" +
                         $"### 💶 Commercial Revenue\n" +
                         $"• **Gross Package Revenue**: `€{grossRevenue:N2}`\n" +
                         $"• **Base Contract Fee**: `€{tour.BaseFee:N2}`\n" +
                         $"• **Passengers**: `{tour.Pax}` Pax (Avg Revenue/Pax: `€{(tour.Pax > 0 ? grossRevenue / tour.Pax : 0):N2}`)\n\n" +
                         $"### 📉 Operational Supplier Expenses\n" +
                         $"• **Hotel Accommodations**: `€{hotelCosts:N2}`\n" +
                         $"• **Guide Remuneration**: `€{guideCosts:N2}`\n" +
                         $"• **Coach Transport & Driver**: `€{transportCosts:N2}`\n" +
                         $"• **Other Operational Services**: `€{otherCosts:N2}`\n" +
                         $"• **Total Cost of Tour**: `€{totalExpenses:N2}`\n\n" +
                         $"### 📊 Net Operational Margin\n" +
                         $"• **Net Profit Margin (€)**: `€{netMargin:N2}`\n" +
                         $"• **Profit Margin (%)**: `{marginPercent:F1}%` ({healthEmoji})\n" +
                         $"• **Excursion Guide Commission Rate**: `{tour.GuideCommission}%`",
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = "Open Tour Costing", Path = $"/projects/{tour.ProjectId}/tours/{tour.Id}" }
                },
                SuggestedPills = new List<string>
                {
                    $"Hotel stays for {tour.TourCode}",
                    $"Who is the guide for {tour.TourCode}?",
                    $"In which city is {tour.TourCode} today?",
                    "Executive KPI Dashboard"
                }
            };

            return response;
        }

        private async Task<AIChatResponse> HandleTourPassengersAsync(Tour tour)
        {
            var passengers = await _context.Passengers
                .Where(p => p.TourId == tour.Id)
                .ToListAsync();

            var singles = passengers.Count(p => p.RoomType != null && p.RoomType.Equals("Single", StringComparison.OrdinalIgnoreCase));
            var doubles = passengers.Count(p => p.RoomType != null && (p.RoomType.Equals("Double", StringComparison.OrdinalIgnoreCase) || p.RoomType.Equals("Twin", StringComparison.OrdinalIgnoreCase)));
            var triples = passengers.Count(p => p.RoomType != null && p.RoomType.Equals("Triple", StringComparison.OrdinalIgnoreCase));

            var response = new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = $"👋 **Passenger Manifest & Rooming Allocation for Tour `{tour.TourCode}`**:\n\n" +
                         $"### 👥 Passenger Breakdown\n" +
                         $"• **Total Registered Passengers**: `{tour.Pax}` Pax\n" +
                         $"• **Adults**: `{tour.Adults}` (Rate: `€{tour.AdultRate:N2}`)\n" +
                         $"• **Children**: `{tour.Children}` (Rate: `€{tour.ChildRate:N2}`)\n" +
                         $"• **Infants**: `{tour.Infants}` (Rate: `€{tour.InfantRate:N2}`)\n\n" +
                         $"### 🛏️ Rooming Distribution\n" +
                         $"• **Single Rooms**: `{singles}` passengers\n" +
                         $"• **Double / Twin Rooms**: `{doubles}` passengers\n" +
                         $"• **Triple Rooms**: `{triples}` passengers\n" +
                         $"• **Detailed Manifest Records**: `{passengers.Count}` passengers loaded in database.",
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = "View Rooming List", Path = $"/projects/{tour.ProjectId}/tours/{tour.Id}" }
                },
                SuggestedPills = new List<string>
                {
                    $"In which city is {tour.TourCode} today?",
                    $"What is the margin for {tour.TourCode}?",
                    $"Who is the guide for {tour.TourCode}?",
                    "How to import Excel rooming list?"
                }
            };

            return response;
        }

        private AIChatResponse HandleTourStatus(Tour tour, List<TourService> services)
        {
            var statusName = tour.TourStatus?.Name ?? "Draft";
            var hasHotel = services.Any(s => s.HotelId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Hotel", StringComparison.OrdinalIgnoreCase)));
            var hasGuide = services.Any(s => s.GuideId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Guide", StringComparison.OrdinalIgnoreCase)));
            var hasTransport = services.Any(s => s.DriverId.HasValue || s.TransportCompanyId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Transport", StringComparison.OrdinalIgnoreCase)));
            var hasPricing = tour.BaseFee > 0 || tour.TotalFee > 0;

            string gateSummary;
            if (tour.TourStatusId == 1) // Draft
            {
                gateSummary = "Gate 1 (Draft ➔ Proposal): Destination is set. Add hotel, guide, and pricing to unlock Confirmed.";
            }
            else if (tour.TourStatusId == 2) // Proposal
            {
                bool readyForConfirmed = hasHotel && hasGuide && hasTransport && hasPricing;
                gateSummary = readyForConfirmed 
                    ? "🟢 **GATE READY**: All suppliers (Hotel, Guide, Transport, Pricing) are locked. Ready to advance to Confirmed!"
                    : "⚠️ **Gate 2 Blocked**: Missing required assignments (verify Hotel, Guide, Transport, or Base Fee).";
            }
            else if (tour.TourStatusId == 3) // Confirmed
            {
                gateSummary = $"Locked and confirmed for departure on `{tour.ArrivalDate:dd/MM/yyyy}`.";
            }
            else if (tour.TourStatusId == 4) // In Progress
            {
                gateSummary = $"Tour is currently departing on the ground. Ends on `{tour.EndDate:dd/MM/yyyy}`.";
            }
            else
            {
                gateSummary = "Tour is completed and locked in system records.";
            }

            var response = new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = $"👋 **Status & Gate Checkpoint Report for Tour `{tour.TourCode}`**:\n\n" +
                         $"• **Current Status**: 🏷️ **`{statusName}`**\n" +
                         $"• **Accounting Lockdown**: `{(tour.AccountingClosed ? "🔒 Locked / Closed" : "🔓 Open for Edits")}`\n" +
                         $"• **Departure Bounds**: `{tour.ArrivalDate:dd/MM/yyyy}` ➔ `{tour.EndDate:dd/MM/yyyy}`\n\n" +
                         $"### 🚦 Gate Checkpoint Readiness\n" +
                         $"• **Hotel Contracted**: `{(hasHotel ? "✅ Yes" : "❌ Missing")}`\n" +
                         $"• **Guide Assigned**: `{(hasGuide ? "✅ Yes" : "❌ Missing")}`\n" +
                         $"• **Transport Locked**: `{(hasTransport ? "✅ Yes" : "❌ Missing")}`\n" +
                         $"• **Package Fee / Pricing**: `{(hasPricing ? $"✅ €{tour.TotalFee:N2}" : "❌ Missing Base Fee")}`\n\n" +
                         $"**Gate Directive**: {gateSummary}",
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = $"Inspect {tour.TourCode} Gate", Path = $"/projects/{tour.ProjectId}/tours/{tour.Id}" }
                },
                SuggestedPills = new List<string>
                {
                    "Tour status transition criteria",
                    $"In which city is {tour.TourCode} today?",
                    $"Who is the guide for {tour.TourCode}?",
                    $"What is the margin for {tour.TourCode}?"
                }
            };

            return response;
        }

        private AIChatResponse HandleTourProgressSummary(Tour tour, List<TourService> services, List<Hotel> hotels, List<Guide> guides)
        {
            var grossRevenue = tour.TotalFee > 0 ? tour.TotalFee : tour.BaseFee;
            var totalExpenses = services.Where(s => s.IsRevenue != true).Sum(s => s.TotalAmount);
            var netMargin = grossRevenue - totalExpenses;
            var marginPercent = grossRevenue > 0 ? (netMargin / grossRevenue) * 100 : 0;
            var statusName = tour.TourStatus?.Name ?? "Draft";

            // Guide
            var guideService = services.FirstOrDefault(s => s.GuideId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Guide", StringComparison.OrdinalIgnoreCase)));
            var guideName = "⚠️ Unassigned";
            if (guideService?.GuideId != null)
            {
                var g = guides.FirstOrDefault(x => x.Id == guideService.GuideId);
                if (g != null) guideName = $"👤 {g.Name}";
            }

            // Hotel
            var hotelCount = services.Count(s => s.HotelId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Hotel", StringComparison.OrdinalIgnoreCase)));
            var hotelStay = services.FirstOrDefault(s => s.HotelId.HasValue);
            var hotelName = hotelStay != null ? hotels.FirstOrDefault(h => h.Id == hotelStay.HotelId)?.Name ?? "Hotel booked" : "None";

            // Lifecycle timing
            var today = DateTime.Today;
            string lifecycleStage;
            if (tour.TourStatusId == 5 || (tour.EndDate != default && today > tour.EndDate.Date))
            {
                lifecycleStage = $"🏁 **Completed**: The tour concluded on `{tour.EndDate:dd/MM/yyyy}`.";
            }
            else if (tour.ArrivalDate != default && today < tour.ArrivalDate.Date)
            {
                var daysUntil = (tour.ArrivalDate.Date - today).Days;
                lifecycleStage = $"⏳ **Upcoming Departure**: Starts in `{daysUntil}` days on `{tour.ArrivalDate:dd/MM/yyyy}`.";
            }
            else if (tour.ArrivalDate != default && tour.EndDate != default)
            {
                var currentDay = (today - tour.ArrivalDate.Date).Days + 1;
                var totalDays = (tour.EndDate.Date - tour.ArrivalDate.Date).Days + 1;
                lifecycleStage = $"🚀 **Currently Active on Ground**: Today is **Day {currentDay} of {totalDays}**.";
            }
            else
            {
                lifecycleStage = $"🏷️ Current Stage: **{statusName}**";
            }

            string marginBadge = marginPercent >= 20 ? "🟢 Healthy" : marginPercent >= 10 ? "🟡 Moderate" : "🔴 Low / Review Costs";

            var advisoryBlock = BuildAdvisorySnippet(tour, services, today);

            var response = new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = $"👋 **Operational Health & Progress for Tour `{tour.TourCode}`**:\n\n" +
                         $"{lifecycleStage}\n\n" +
                         $"### 📋 Tour Status & Route\n" +
                         $"• **Status**: 🏷️ **`{statusName}`** `{(tour.AccountingClosed ? "(🔒 Accounting Closed)" : "(🔓 Open)")}`\n" +
                         $"• **Route & Dates**: `{tour.Destination}` | `{tour.ArrivalDate:dd/MM/yyyy}` ➔ `{tour.EndDate:dd/MM/yyyy}`\n" +
                         $"• **Passenger Group**: `{tour.Pax}` Pax registered ({tour.Adults} Adults, {tour.Children} Children)\n\n" +
                         $"### 💶 Financial Performance\n" +
                         $"• **Package Revenue**: `€{grossRevenue:N2}`\n" +
                         $"• **Supplier Expenses**: `€{totalExpenses:N2}`\n" +
                         $"• **Net Profit Margin**: `€{netMargin:N2}` (`{marginPercent:F1}%` — {marginBadge})\n\n" +
                         $"### 🏨 Operations & Logistics\n" +
                         $"• **Assigned Guide**: {guideName}\n" +
                         $"• **Accommodations**: `{hotelCount}` stay(s) registered (Primary: `{hotelName}`)\n\n" +
                         $"{advisoryBlock}\n\n" +
                         $"Everything for `{tour.TourCode}` is dynamically synchronized with the operations board.",
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = $"Inspect {tour.TourCode} Operations", Path = $"/projects/{tour.ProjectId}/tours/{tour.Id}" }
                },
                SuggestedPills = new List<string>
                {
                    $"How to proceed with {tour.TourCode}?",
                    $"In which city is {tour.TourCode} today?",
                    $"Who is the guide for {tour.TourCode}?",
                    $"What is the margin for {tour.TourCode}?"
                }
            };

            return response;
        }

        private static string BuildAdvisorySnippet(Tour tour, List<TourService> services, DateTime today)
        {
            var hasHotel = services.Any(s => s.HotelId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Hotel", StringComparison.OrdinalIgnoreCase)));
            var hasGuide = services.Any(s => s.GuideId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Guide", StringComparison.OrdinalIgnoreCase)));
            var hasTransport = services.Any(s => s.DriverId.HasValue || s.TransportCompanyId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Transport", StringComparison.OrdinalIgnoreCase)));
            var hasArrivalFlight = !string.IsNullOrWhiteSpace(tour.ArrivalFlight) && !tour.ArrivalFlight.Equals("Not set", StringComparison.OrdinalIgnoreCase) && !tour.ArrivalFlight.Trim().Equals("-");
            var hasDepartureFlight = !string.IsNullOrWhiteSpace(tour.DepartureFlight) && !tour.DepartureFlight.Equals("Not set", StringComparison.OrdinalIgnoreCase) && !tour.DepartureFlight.Trim().Equals("-");

            var missing = new List<string>();
            if (!hasGuide) missing.Add("Lead Guide");
            if (!hasTransport) missing.Add("Transport & Driver");
            if (!hasHotel) missing.Add("Hotel Accommodations");
            if (!hasArrivalFlight || !hasDepartureFlight) missing.Add("Flight Numbers");

            int daysUntil = tour.ArrivalDate != default ? (tour.ArrivalDate.Date - today.Date).Days : 999;

            if (tour.TourStatusId == 5)
            {
                return !tour.AccountingClosed
                    ? "### ⚠️ Post-Tour Action Required\n• **Accounting Open**: Reconcile guide excursion commission and match supplier invoices before closing the accounting lock."
                    : "### 🔒 Accounting Status\n• Tour completed and accounting lockdown is sealed.";
            }

            if (tour.ArrivalDate != default && today.Date >= tour.ArrivalDate.Date && today.Date <= tour.EndDate.Date)
            {
                return missing.Count > 0
                    ? $"### 🚨 CRITICAL DISRUPTION — ACTIVE ON GROUND\n• **Immediate Action Required**: Tour is running right now, but **{string.Join(", ", missing)}** are missing from the system!"
                    : "### 🟢 Active On Ground\n• Tour is running on schedule with all core services registered.";
            }

            if (daysUntil <= 3 && missing.Count > 0)
            {
                return $"### 🚨 CRITICAL SITUATION — STARTS IN {daysUntil} DAY{(daysUntil == 1 ? "" : "S")}!\n" +
                       $"• **Immediate Action Required**: Tour planned to start on `{tour.ArrivalDate:dd/MM/yyyy}` (**in {daysUntil} day{(daysUntil == 1 ? "" : "s")}**), but **{string.Join(", ", missing)}** are missing! Contract these immediately to avoid operational failure.";
            }

            if (daysUntil <= 7 && missing.Count > 0)
            {
                return $"### 🔴 CRITICAL READINESS ALERT — STARTS IN {daysUntil} DAYS!\n" +
                       $"• **Urgent**: Tour planned to start on `{tour.ArrivalDate:dd/MM/yyyy}` (**in {daysUntil} days**). Missing: **{string.Join(", ", missing)}**. Complete before departure.";
            }

            if (daysUntil <= 21 && missing.Count > 0)
            {
                return $"### ⚠️ High Risk Readiness Warning (Starts in {daysUntil} Days)\n" +
                       $"• Missing: **{string.Join(", ", missing)}**. Complete supplier procurement before supplier room release cutoffs.";
            }

            if (missing.Count == 0)
            {
                return $"### 🟢 Operational Readiness\n• All core services (Hotel, Guide, Transport, Flights) are verified for departure on `{tour.ArrivalDate:dd/MM/yyyy}`.";
            }

            return $"### 📋 Procurement Checklist ({daysUntil} Days to Departure)\n• Pending items: **{string.Join(", ", missing)}**.";
        }

        private AIChatResponse HandleTourAdvisoryAndNextSteps(
            Tour tour, 
            List<TourService> services, 
            List<Hotel> hotels, 
            List<Guide> guides, 
            List<Driver> drivers, 
            List<TransportCompany> transportCos)
        {
            var today = DateTime.Today;
            var response = new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup"
            };

            // 1. Missing Items Detection
            var hasHotel = services.Any(s => s.HotelId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Hotel", StringComparison.OrdinalIgnoreCase)));
            var hasGuide = services.Any(s => s.GuideId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Guide", StringComparison.OrdinalIgnoreCase)));
            var hasTransport = services.Any(s => s.DriverId.HasValue || s.TransportCompanyId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Transport", StringComparison.OrdinalIgnoreCase)));
            
            var hasArrivalFlight = !string.IsNullOrWhiteSpace(tour.ArrivalFlight) && !tour.ArrivalFlight.Equals("Not set", StringComparison.OrdinalIgnoreCase) && !tour.ArrivalFlight.Trim().Equals("-");
            var hasDepartureFlight = !string.IsNullOrWhiteSpace(tour.DepartureFlight) && !tour.DepartureFlight.Equals("Not set", StringComparison.OrdinalIgnoreCase) && !tour.DepartureFlight.Trim().Equals("-");
            var hasPricing = tour.TotalFee > 0 || tour.BaseFee > 0;
            var hasPax = tour.Pax > 0;

            var missingList = new List<string>();
            var actionItems = new List<string>();

            if (!hasGuide)
            {
                missingList.Add("🧭 **Tour Guide**: No lead guide assigned.");
                actionItems.Add("**Assign Lead Guide**: Open *Services* tab and assign a licensed guide for `" + tour.Destination + "`.");
            }
            if (!hasTransport)
            {
                missingList.Add("🚌 **Transportation & Driver**: Coach company and driver are uncontracted.");
                actionItems.Add("**Contract Transport & Driver**: Assign coach provider and driver for airport transfers and route transport.");
            }
            if (!hasHotel)
            {
                missingList.Add("🏨 **Hotel Accommodations**: No hotel reservations registered.");
                actionItems.Add("**Book Hotel Accommodations**: Reserve rooms in " + ExtractStartingCity(tour.Destination) + " and route stops.");
            }
            if (!hasArrivalFlight || !hasDepartureFlight)
            {
                var flightMissing = (!hasArrivalFlight && !hasDepartureFlight) 
                    ? "Both Arrival & Departure flight numbers are missing."
                    : (!hasArrivalFlight ? "Arrival flight number is missing." : "Departure flight number is missing.");
                missingList.Add($"✈️ **Flight Numbers**: {flightMissing}");
                actionItems.Add("**Record Flight Manifest**: Request flight codes from client and enter `Arrival Flight` / `Departure Flight` in Tour Information.");
            }
            if (!hasPricing)
            {
                missingList.Add("💶 **Commercial Pricing**: Base contract fee or pax rate is €0.00.");
                actionItems.Add("**Establish Commercial Pricing**: Define Base Fee or Pax Rates to calculate operational margins.");
            }
            if (!hasPax)
            {
                missingList.Add("👥 **Passenger Count**: 0 Pax registered.");
                actionItems.Add("**Import Rooming List**: Upload the client passenger manifest Excel file.");
            }

            // 2. Timeline Analysis & Urgency Assessment
            string urgencyHeader;
            string urgencyBanner;
            int daysUntilStart = tour.ArrivalDate != default ? (tour.ArrivalDate.Date - today.Date).Days : 999;
            int totalTourDays = (tour.ArrivalDate != default && tour.EndDate != default) 
                ? (tour.EndDate.Date - tour.ArrivalDate.Date).Days + 1 
                : 0;

            if (tour.TourStatusId == 5)
            {
                urgencyHeader = "🏁 **Tour Status: Completed & Concluded**";
                urgencyBanner = $"This tour finished on `{tour.EndDate:dd/MM/yyyy}`.";
                actionItems.Clear();
                if (!tour.AccountingClosed)
                {
                    actionItems.Add("**Reconcile Guide Commissions**: Confirm cash collected from optional excursions against the " + tour.GuideCommission + "% commission rate.");
                    actionItems.Add("**Match Supplier Invoices**: Verify final hotel, transport, and guide invoices against contracted amounts.");
                    actionItems.Add("**Close Accounting Lock**: Check *Accounting Closed* in Tour details to finalize P&L and protect records.");
                }
                else
                {
                    actionItems.Add("• **Accounting Locked**: All financials and operational records are closed and archived.");
                }
            }
            else if (tour.EndDate != default && today.Date > tour.EndDate.Date)
            {
                urgencyHeader = "⚠️ **Past Scheduled Dates (Unconcluded Departure)**";
                urgencyBanner = $"This tour's planned dates (`{tour.ArrivalDate:dd/MM/yyyy}` ➔ `{tour.EndDate:dd/MM/yyyy}`) have ended, but status is still `{tour.TourStatus?.Name ?? "Draft"}`.";
                actionItems.Clear();
                actionItems.Add("**Update Tour Status**: Mark tour as `Completed` if executed, or `Cancelled` if departed dates were not realized.");
                actionItems.Add("**Reconcile Past Operations**: Review supplier billing and finalize accounting lockdown.");
            }
            else if (tour.ArrivalDate != default && today.Date >= tour.ArrivalDate.Date && today.Date <= tour.EndDate.Date)
            {
                var currentDay = (today.Date - tour.ArrivalDate.Date).Days + 1;
                urgencyHeader = $"🚀 **ACTIVE ON GROUND — Day {currentDay} of {totalTourDays}**";
                if (missingList.Count > 0)
                {
                    urgencyBanner = $"🚨 **CRITICAL DISRUPTION**: Tour is executing right now on the ground, but essential services are missing in the system! Immediate manual intervention is required.";
                }
                else
                {
                    urgencyBanner = $"Tour is running on schedule in `{tour.Destination}`. Monitor daily supplier execution.";
                    actionItems.Add("• **Track Daily Excursions**: Log optional tour sales for guide commission calculation.");
                    actionItems.Add("• **Verify Vouchers**: Confirm daily hotel check-ins and coach departure timings.");
                }
            }
            else if (daysUntilStart <= 3 && missingList.Count > 0)
            {
                urgencyHeader = $"🚨 **CRITICAL SITUATION — STARTS IN {daysUntilStart} DAY{(daysUntilStart == 1 ? "" : "S")}!**";
                urgencyBanner = $"The tour is planned to start on `{tour.ArrivalDate:dd/MM/yyyy}` (**in only {daysUntilStart} day{(daysUntilStart == 1 ? "" : "s")}**). Critical services are missing! Immediate completion of missing items is mandatory before departure.";
            }
            else if (daysUntilStart <= 7 && missingList.Count > 0)
            {
                urgencyHeader = $"🔴 **CRITICAL READINESS ALERT — STARTS IN {daysUntilStart} DAYS!**";
                urgencyBanner = $"The tour is planned to start on `{tour.ArrivalDate:dd/MM/yyyy}` (**in {daysUntilStart} days**). Essential services (guide, transport, hotel, flights) must be completed immediately to prevent supplier cancellation.";
            }
            else if (daysUntilStart <= 14 && missingList.Count > 0)
            {
                urgencyHeader = $"🟠 **HIGH RISK — DEPARTURE IN {daysUntilStart} DAYS**";
                urgencyBanner = $"The tour is planned to start on `{tour.ArrivalDate:dd/MM/yyyy}` (**in {daysUntilStart} days**). Pending services risk room attrition penalties and driver unavailability.";
            }
            else if (daysUntilStart <= 30 && missingList.Count > 0)
            {
                urgencyHeader = $"🟡 **ACTION REQUIRED — DEPARTURE IN {daysUntilStart} DAYS**";
                urgencyBanner = $"The tour is planned to start on `{tour.ArrivalDate:dd/MM/yyyy}` (**in {daysUntilStart} days**). Finalize all supplier reservations prior to the 30-day cutoff.";
            }
            else if (missingList.Count == 0)
            {
                urgencyHeader = "🟢 **READY FOR DISPATCH & FULLY CONTRACTED**";
                urgencyBanner = $"All core services (Guide, Transport, Hotel Reservations, Flight #s) are verified. Tour is scheduled to depart on `{tour.ArrivalDate:dd/MM/yyyy}` ({daysUntilStart} days away).";
                if (tour.TourStatusId < 3)
                {
                    actionItems.Add("• **Advance to Confirmed**: Tour has passed all supplier readiness checks. Transition status from `" + (tour.TourStatus?.Name ?? "Draft") + "` to `Confirmed`.");
                }
            }
            else
            {
                urgencyHeader = $"📋 **OPERATIONAL READINESS ADVISORY ({daysUntilStart} Days to Departure)**";
                urgencyBanner = $"The tour is planned to start on `{tour.ArrivalDate:dd/MM/yyyy}` (**in {daysUntilStart} days**). Complete the operational checklist items below:";
            }

            var missingSection = missingList.Count > 0
                ? $"### ⚠️ Missing Critical Services & Data\n" + string.Join("\n", missingList.Select(m => $"• {m}")) + "\n\n"
                : "### ✅ Mandatory Services Check\n• All core services (Hotel, Guide, Transport, Flight Numbers) are in place.\n\n";

            var actionSection = actionItems.Count > 0
                ? $"### 🛠️ Recommended Action Plan (How to Proceed)\n" + string.Join("\n", actionItems.Select((a, idx) => a.StartsWith("•") ? a : $"{idx + 1}. {a}"))
                : "";

            response.Answer = $"👋 **Operational Advisory & Readiness for Tour `{tour.TourCode}`**:\n\n" +
                              $"{urgencyHeader}\n" +
                              $"{urgencyBanner}\n\n" +
                              $"• **Route & Timing**: `{tour.Destination}` | `{tour.ArrivalDate:dd/MM/yyyy}` ➔ `{tour.EndDate:dd/MM/yyyy}`\n" +
                              $"• **Current Status**: 🏷️ **`{tour.TourStatus?.Name ?? "Draft"}`** | **Passengers**: `{tour.Pax}` Pax\n\n" +
                              missingSection +
                              actionSection;

            response.RecommendedLinks = new List<QuickActionLink>
            {
                new QuickActionLink { Label = $"Open {tour.TourCode} Operations", Path = $"/projects/{tour.ProjectId}/tours/{tour.Id}" }
            };

            response.SuggestedPills = new List<string>
            {
                $"In which city is {tour.TourCode} today?",
                $"Who is the guide for {tour.TourCode}?",
                $"Hotel stays for {tour.TourCode}",
                $"What is the margin for {tour.TourCode}?"
            };

            return response;
        }

        private AIChatResponse HandleTourMasterCard(Tour tour, List<TourService> services, List<Hotel> hotels, List<Guide> guides)
        {
            var grossRevenue = tour.TotalFee > 0 ? tour.TotalFee : tour.BaseFee;
            var totalExpenses = services.Where(s => s.IsRevenue != true).Sum(s => s.TotalAmount);
            var netMargin = grossRevenue - totalExpenses;
            var marginPercent = grossRevenue > 0 ? (netMargin / grossRevenue) * 100 : 0;

            var guideService = services.FirstOrDefault(s => s.GuideId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Guide", StringComparison.OrdinalIgnoreCase)));
            var guideName = "Not Assigned";
            if (guideService?.GuideId != null)
            {
                var g = guides.FirstOrDefault(x => x.Id == guideService.GuideId);
                if (g != null) guideName = g.Name;
            }

            var hotelCount = services.Count(s => s.HotelId.HasValue || (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Hotel", StringComparison.OrdinalIgnoreCase)));

            var response = new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = $"👋 **Operational Briefing for Tour `{tour.TourCode}`**:\n\n" +
                         $"• **Destination**: `{tour.Destination}`\n" +
                         $"• **Dates**: `{tour.ArrivalDate:dd/MM/yyyy}` ➔ `{tour.EndDate:dd/MM/yyyy}`\n" +
                         $"• **Status**: 🏷️ **`{tour.TourStatus?.Name ?? "Draft"}`**\n" +
                         $"• **Passengers**: `{tour.Pax}` Pax ({tour.Adults} Adults, {tour.Children} Children)\n" +
                         $"• **Primary Guide**: `{guideName}`\n" +
                         $"• **Hotel Reservations**: `{hotelCount}` stays registered\n" +
                         $"• **Commercial Revenue**: `€{grossRevenue:N2}`\n" +
                         $"• **Net Profit Margin**: `€{netMargin:N2}` (`{marginPercent:F1}%`)",
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = $"Open {tour.TourCode} Details", Path = $"/projects/{tour.ProjectId}/tours/{tour.Id}" }
                },
                SuggestedPills = new List<string>
                {
                    $"In which city is {tour.TourCode} today?",
                    $"Who is the guide for {tour.TourCode}?",
                    $"Hotel stays for {tour.TourCode}",
                    $"What is the margin for {tour.TourCode}?"
                }
            };

            return response;
        }

        #endregion

        #region Project Intent Processing

        private Task<AIChatResponse> ProcessProjectIntentAsync(Project project, string q)
        {
            var tours = project.Tours ?? new List<Tour>();
            var totalPax = tours.Sum(t => t.Pax);
            var totalRev = tours.Sum(t => t.TotalFee > 0 ? t.TotalFee : t.BaseFee);
            var confirmedTours = tours.Count(t => t.TourStatusId == 3);
            var clientName = project.Client?.Name ?? "UNO DMC";

            var tourList = tours.Take(5).Select(t => $"• **{t.TourCode}** ({t.Destination}): `{t.ArrivalDate:dd/MM}` – `{t.Pax} Pax` (Status: `{t.TourStatus?.Name ?? "Active"}`)").ToList();

            var response = new AIChatResponse
            {
                Category = "Projects",
                Mode = "Live-DB-Entity-Lookup",
                Answer = $"👋 **Commercial Project Briefing: `{project.ProjectCode}`**:\n\n" +
                         $"• **Project Description**: `{project.Description}`\n" +
                         $"• **Client**: `{clientName}`\n" +
                         $"• **Contract Budget**: `€{project.ApproxBudget:N2}`\n" +
                         $"• **Status**: 🏷️ **`{project.ProjectStatus?.Name ?? "Active"}`**\n" +
                         $"• **Linked Departures**: `{tours.Count}` Tours ({confirmedTours} Confirmed)\n" +
                         $"• **Combined Passengers**: `{totalPax}` Pax\n" +
                         $"• **Rolled-up Tour Revenue**: `€{totalRev:N2}`\n\n" +
                         $"📁 **Upcoming Tour Departures**:\n" +
                         (tourList.Count > 0 ? string.Join("\n", tourList) : "• *No tour departures currently linked to this project.*"),
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = $"Open {project.ProjectCode} Dashboard", Path = "/projects" }
                },
                SuggestedPills = new List<string>
                {
                    "Summarize active tours",
                    "How to create a project?",
                    "Executive KPI Dashboard"
                }
            };

            return Task.FromResult(response);
        }

        #endregion

        #region Helpers

        private static string ExtractStartingCity(string destination)
        {
            if (string.IsNullOrWhiteSpace(destination)) return "Budapest";
            var parts = SplitRouteCities(destination);
            return parts.Count > 0 ? parts[0] : "Budapest";
        }

        private static string ExtractEndingCity(string destination)
        {
            if (string.IsNullOrWhiteSpace(destination)) return "Prague";
            var parts = SplitRouteCities(destination);
            return parts.Count > 0 ? parts[parts.Count - 1] : "Prague";
        }

        private static List<string> SplitRouteCities(string destination)
        {
            if (string.IsNullOrWhiteSpace(destination)) return new List<string> { "Budapest", "Vienna", "Prague" };

            // Handle codes like "BVP" or "PVB"
            if (destination.Equals("BVP", StringComparison.OrdinalIgnoreCase) || destination.Contains("BVP"))
                return new List<string> { "Budapest", "Vienna", "Prague" };
            if (destination.Equals("PVB", StringComparison.OrdinalIgnoreCase) || destination.Contains("PVB"))
                return new List<string> { "Prague", "Vienna", "Budapest" };

            var items = destination.Split(new[] { '-', '—', '/', '➔', '>', ',' }, StringSplitOptions.RemoveEmptyEntries)
                                   .Select(s => s.Trim())
                                   .Where(s => !string.IsNullOrWhiteSpace(s))
                                   .ToList();

            return items.Count > 0 ? items : new List<string> { "Budapest", "Vienna", "Prague" };
        }

        private static string EstimateCityFromRoute(string destination, int currentDay, int totalNights)
        {
            var cities = SplitRouteCities(destination);
            if (cities.Count == 0) return "Vienna";
            if (cities.Count == 1) return cities[0];

            double progress = (double)(currentDay - 1) / Math.Max(1, totalNights);
            int index = (int)Math.Floor(progress * cities.Count);
            if (index >= cities.Count) index = cities.Count - 1;
            if (index < 0) index = 0;

            return cities[index];
        }

        #endregion
    }
}
