using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Uno_API.Controllers;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Services
{
    public partial class TourProjectLookupService
    {
        public class TourFinancialBenchmark
        {
            public int TourId { get; set; }
            public string TourCode { get; set; } = string.Empty;
            public string Destination { get; set; } = string.Empty;
            public string Status { get; set; } = "Draft";
            public int StatusId { get; set; }
            public DateTime ArrivalDate { get; set; }
            public DateTime EndDate { get; set; }
            public int Nights { get; set; }
            public int Pax { get; set; }
            public int Adults { get; set; }
            public int Children { get; set; }
            public int ProjectId { get; set; }
            public string ProjectCode { get; set; } = string.Empty;

            // Commercial Revenue
            public decimal GrossRevenue { get; set; }
            public decimal BaseFee { get; set; }
            public decimal RevenuePerPax { get; set; }

            // Hotel Expenses
            public decimal HotelCost { get; set; }
            public decimal HotelCostPerPax { get; set; }
            public decimal HotelCostPerPaxPerNight { get; set; }
            public int HotelStayCount { get; set; }
            public string HotelNames { get; set; } = string.Empty;

            // Guide Remuneration
            public decimal GuideCost { get; set; }
            public decimal GuideCostPerPax { get; set; }
            public string GuideName { get; set; } = string.Empty;
            public decimal GuideCommissionRate { get; set; }

            // Coach Transport & Driver
            public decimal TransportCost { get; set; }
            public decimal TransportCostPerPax { get; set; }
            public string TransportCompanyOrDriver { get; set; } = string.Empty;

            // Optional Excursions
            public decimal ExcursionSales { get; set; }
            public decimal ExcursionSalesPerPax { get; set; }
            public decimal ExcursionCost { get; set; }
            public decimal ExcursionNetMargin { get; set; }
            public int ExcursionCount { get; set; }

            // Other & Overall Expenses
            public decimal OtherCost { get; set; }
            public decimal TotalExpenses { get; set; }
            public decimal TotalCostPerPax { get; set; }

            // Net Profit Margin
            public decimal NetMargin { get; set; }
            public decimal MarginPercent { get; set; }
            public decimal MarginPerPax { get; set; }
        }

        private async Task<AIChatResponse?> HandleTourComparisonAsync(string q, string? contextUrl)
        {
            var allTours = await _context.Tours
                .Include(t => t.Project)
                .Include(t => t.TourStatus)
                .ToListAsync();

            if (allTours.Count == 0) return null;

            // 1. Check for specific tours named in the query
            var mentionedTours = new List<Tour>();
            foreach (var t in allTours.Where(x => !string.IsNullOrWhiteSpace(x.TourCode)).OrderByDescending(x => x.TourCode.Length))
            {
                var codeLower = t.TourCode.ToLowerInvariant();
                if (Regex.IsMatch(q, $@"\b{Regex.Escape(codeLower)}\b", RegexOptions.IgnoreCase) || q.Contains(codeLower))
                {
                    if (!mentionedTours.Any(m => m.Id == t.Id))
                    {
                        mentionedTours.Add(t);
                    }
                }
            }

            // Also check for "tour #X" or "tour X"
            var numMatches = Regex.Matches(q, @"\btour\s*#?\s*(\d+)\b", RegexOptions.IgnoreCase);
            foreach (Match m in numMatches)
            {
                if (int.TryParse(m.Groups[1].Value, out int tid))
                {
                    var found = allTours.FirstOrDefault(x => x.Id == tid || x.TourCode.Equals($"Tour{tid}", StringComparison.OrdinalIgnoreCase));
                    if (found != null && !mentionedTours.Any(x => x.Id == found.Id))
                    {
                        mentionedTours.Add(found);
                    }
                }
            }

            // 2. Resolve Active Target Tour (from query or screen context)
            Tour? targetTour = null;
            if (mentionedTours.Count == 1)
            {
                targetTour = mentionedTours[0];
            }
            else if (!string.IsNullOrWhiteSpace(contextUrl))
            {
                var routeTourMatch = Regex.Match(contextUrl, @"/tours/(\d+)", RegexOptions.IgnoreCase);
                if (routeTourMatch.Success && int.TryParse(routeTourMatch.Groups[1].Value, out int activeTourId))
                {
                    targetTour = allTours.FirstOrDefault(t => t.Id == activeTourId);
                    if (targetTour != null && !mentionedTours.Any(x => x.Id == targetTour.Id))
                    {
                        mentionedTours.Insert(0, targetTour);
                    }
                }
            }

            // 3. Determine Cohort & Mode
            // Mode A: Head-to-Head Comparison (Two Specific Tours)
            if (mentionedTours.Count >= 2 && !q.Contains("other tours") && !q.Contains("same month") && !q.Contains("all tours"))
            {
                var tourA = mentionedTours[0];
                var tourB = mentionedTours[1];
                return await RenderHeadToHeadComparisonAsync(tourA, tourB, q);
            }

            // Mode B: Target Tour vs Cohort (e.g. Same Month, Same Project, or Route)
            // If targetTour is null, try to resolve one from the query
            if (targetTour == null && allTours.Count > 0)
            {
                targetTour = await ResolveTourEntityAsync(q, contextUrl);
            }

            // Determine Target Year & Month for Month Cohort
            int targetMonth = DateTime.Today.Month;
            int targetYear = DateTime.Today.Year;
            bool isMonthCohort = q.Contains("month") || q.Contains("same month") || q.Contains("this month");

            // Look for explicit month names in the query (e.g. "september", "august")
            var monthNames = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
            {
                { "january", 1 }, { "jan", 1 }, { "february", 2 }, { "feb", 2 },
                { "march", 3 }, { "mar", 3 }, { "april", 4 }, { "apr", 4 },
                { "may", 5 }, { "june", 6 }, { "jun", 6 }, { "july", 7 }, { "jul", 7 },
                { "august", 8 }, { "aug", 8 }, { "september", 9 }, { "sep", 9 }, { "sept", 9 },
                { "october", 10 }, { "oct", 10 }, { "november", 11 }, { "nov", 11 },
                { "december", 12 }, { "dec", 12 }
            };

            foreach (var kvp in monthNames)
            {
                if (Regex.IsMatch(q, $@"\b{kvp.Key}\b", RegexOptions.IgnoreCase))
                {
                    targetMonth = kvp.Value;
                    isMonthCohort = true;
                    break;
                }
            }

            if (targetTour != null && targetTour.ArrivalDate != default && !q.Contains("in january") && !q.Contains("in august") && !q.Contains("in september"))
            {
                targetMonth = targetTour.ArrivalDate.Month;
                targetYear = targetTour.ArrivalDate.Year;
            }

            // Build Cohort List
            List<Tour> cohortTours;
            string cohortDescription;

            if (isMonthCohort || targetTour != null)
            {
                // Find all tours operating in targetMonth / targetYear
                var monthStart = new DateTime(targetYear, targetMonth, 1);
                var monthEnd = new DateTime(targetYear, targetMonth, DateTime.DaysInMonth(targetYear, targetMonth));

                cohortTours = allTours.Where(t =>
                    (t.ArrivalDate != default && t.ArrivalDate.Year == targetYear && t.ArrivalDate.Month == targetMonth) ||
                    (t.EndDate != default && t.EndDate.Year == targetYear && t.EndDate.Month == targetMonth) ||
                    (t.ArrivalDate != default && t.EndDate != default && t.ArrivalDate <= monthEnd && t.EndDate >= monthStart)
                ).ToList();

                var monthLabel = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(targetMonth) + " " + targetYear;
                cohortDescription = $"Tours operating in **{monthLabel}**";

                // Ensure targetTour is included in cohort
                if (targetTour != null && !cohortTours.Any(t => t.Id == targetTour.Id))
                {
                    cohortTours.Insert(0, targetTour);
                }
            }
            else if (q.Contains("project") && targetTour?.Project != null)
            {
                cohortTours = allTours.Where(t => t.ProjectId == targetTour.ProjectId).ToList();
                cohortDescription = $"Tours in project **{targetTour.Project.ProjectCode}**";
            }
            else
            {
                cohortTours = allTours.Take(15).ToList();
                cohortDescription = "Active Operations Cohort";
            }

            if (cohortTours.Count == 0)
            {
                cohortTours = allTours.Take(10).ToList();
                cohortDescription = "All Registered Tours";
            }

            // 4. Calculate Financial & Operational Benchmarks for All Cohort Tours
            var cohortIds = cohortTours.Select(t => t.Id).ToList();
            var allCohortServices = await _context.TourServices
                .Include(s => s.ServiceCategory)
                .Where(s => cohortIds.Contains(s.TourId))
                .ToListAsync();

            var allHotels = await _context.Hotels.ToListAsync();
            var allGuides = await _context.Guides.ToListAsync();
            var allBookings = await _context.Bookings.Where(b => cohortIds.Contains(b.TourId)).ToListAsync();

            var benchmarks = new List<TourFinancialBenchmark>();
            foreach (var t in cohortTours)
            {
                var tourSvc = allCohortServices.Where(s => s.TourId == t.Id).ToList();
                var tourBookings = allBookings.Where(b => b.TourId == t.Id).ToList();
                benchmarks.Add(ComputeTourBenchmark(t, tourSvc, allHotels, allGuides, tourBookings));
            }

            // 5. Detect Metric Focus & Render Tailored Benchmark Report
            bool isHotel = q.Contains("hotel") || q.Contains("room") || q.Contains("stay") || q.Contains("accommodation");
            bool isExcursion = q.Contains("excursion") || q.Contains("optional") || q.Contains("activity");
            bool isExpense = (q.Contains("expense") || q.Contains("cost") || q.Contains("spending")) && !isHotel && !isExcursion;
            bool isRevenue = q.Contains("revenue") || q.Contains("turnover") || q.Contains("gross") || q.Contains("fee") || q.Contains("base");
            bool isMargin = q.Contains("margin") || q.Contains("profit");

            if (isHotel)
            {
                return RenderHotelPriceComparison(targetTour, benchmarks, cohortDescription);
            }
            else if (isExcursion)
            {
                return RenderExcursionSalesComparison(targetTour, benchmarks, cohortDescription);
            }
            else if (isExpense)
            {
                return RenderOperationalExpensesComparison(targetTour, benchmarks, cohortDescription);
            }
            else if (isRevenue || isMargin)
            {
                return RenderRevenueAndMarginComparison(targetTour, benchmarks, cohortDescription);
            }

            // Default: Comprehensive Multi-Item Executive Benchmark
            return RenderComprehensiveBenchmark(targetTour, benchmarks, cohortDescription);
        }

        private TourFinancialBenchmark ComputeTourBenchmark(
            Tour tour,
            List<TourService> services,
            List<Hotel> hotels,
            List<Guide> guides,
            List<Booking> bookings)
        {
            var pax = tour.Pax > 0 ? tour.Pax : (tour.Adults + tour.Children > 0 ? tour.Adults + tour.Children : 1);
            var nights = (tour.EndDate != default && tour.ArrivalDate != default && tour.EndDate > tour.ArrivalDate)
                ? (tour.EndDate.Date - tour.ArrivalDate.Date).Days
                : 7;

            // 1. Hotel Services & Accommodation Costs
            var hotelServices = services.Where(s => s.HotelId.HasValue ||
                (s.ServiceCategory != null && (s.ServiceCategory.Name.Equals("Hotel", StringComparison.OrdinalIgnoreCase) ||
                                               s.ServiceCategory.Name.Equals("Hotel Tax", StringComparison.OrdinalIgnoreCase) ||
                                               s.ServiceCategory.Name.Equals("Hotel Discount", StringComparison.OrdinalIgnoreCase)))).ToList();

            var totalHotelCost = hotelServices.Where(s => s.IsRevenue != true).Sum(s => s.TotalAmount);
            var hotelNames = string.Join(", ", hotelServices
                .Where(s => s.HotelId.HasValue)
                .Select(s => hotels.FirstOrDefault(h => h.Id == s.HotelId)?.Name ?? s.Description)
                .Distinct()
                .Take(2));
            if (string.IsNullOrWhiteSpace(hotelNames) && hotelServices.Count > 0)
            {
                hotelNames = hotelServices[0].Description;
            }

            // 2. Guide Services & Personnel
            var guideServices = services.Where(s => s.GuideId.HasValue ||
                (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Guide", StringComparison.OrdinalIgnoreCase))).ToList();
            var totalGuideCost = guideServices.Where(s => s.IsRevenue != true).Sum(s => s.TotalAmount);
            var leadGuide = guideServices
                .Where(s => s.GuideId.HasValue)
                .Select(s => guides.FirstOrDefault(g => g.Id == s.GuideId)?.Name)
                .FirstOrDefault() ?? "Unassigned";

            // 3. Transport & Driver
            var transportServices = services.Where(s => s.DriverId.HasValue || s.TransportCompanyId.HasValue ||
                (s.ServiceCategory != null && (s.ServiceCategory.Name.Equals("Transport", StringComparison.OrdinalIgnoreCase) ||
                                               s.ServiceCategory.Name.Equals("Driver", StringComparison.OrdinalIgnoreCase)))).ToList();
            var totalTransportCost = transportServices.Where(s => s.IsRevenue != true).Sum(s => s.TotalAmount);
            var transportDesc = transportServices.FirstOrDefault()?.Description ?? "Unassigned";

            // 4. Optional Excursions
            var excursionServices = services.Where(s => s.ExcursionId.HasValue ||
                (s.ServiceCategory != null && s.ServiceCategory.Name.Equals("Excursion", StringComparison.OrdinalIgnoreCase))).ToList();
            var excursionSalesFromSvc = excursionServices.Where(s => s.IsRevenue == true || (s.ServiceCategory != null && s.ServiceCategory.IsRevenue)).Sum(s => s.TotalAmount);
            var excursionBookings = bookings.Where(b => b.ServiceType != null && b.ServiceType.Equals("Excursion", StringComparison.OrdinalIgnoreCase)).Sum(b => b.TotalAmount);
            var totalExcursionSales = excursionSalesFromSvc > 0 ? excursionSalesFromSvc : excursionBookings;
            var excursionCost = excursionServices.Where(s => s.IsRevenue != true && (s.ServiceCategory == null || !s.ServiceCategory.IsRevenue)).Sum(s => s.TotalAmount);

            // 5. Other Costs
            var categorizedIds = new HashSet<int>(hotelServices.Concat(guideServices).Concat(transportServices).Concat(excursionServices).Select(s => s.Id));
            var otherServices = services.Where(s => !categorizedIds.Contains(s.Id) && s.IsRevenue != true && (s.ServiceCategory == null || !s.ServiceCategory.IsRevenue)).ToList();
            var totalOtherCost = otherServices.Sum(s => s.TotalAmount);

            // 6. Overall Financials
            var totalExpenses = totalHotelCost + totalGuideCost + totalTransportCost + totalOtherCost + excursionCost;
            var grossRevenue = tour.TotalFee > 0 ? tour.TotalFee : tour.BaseFee;
            if (totalExcursionSales > 0) grossRevenue += totalExcursionSales;

            var netMargin = grossRevenue - totalExpenses;
            var marginPercent = grossRevenue > 0 ? (netMargin / grossRevenue) * 100m : 0m;

            return new TourFinancialBenchmark
            {
                TourId = tour.Id,
                TourCode = tour.TourCode,
                Destination = tour.Destination,
                Status = tour.TourStatus?.Name ?? "Draft",
                StatusId = tour.TourStatusId,
                ArrivalDate = tour.ArrivalDate,
                EndDate = tour.EndDate,
                Nights = nights,
                Pax = pax,
                Adults = tour.Adults,
                Children = tour.Children,
                ProjectId = tour.ProjectId,
                ProjectCode = tour.Project?.ProjectCode ?? $"Project #{tour.ProjectId}",

                GrossRevenue = grossRevenue,
                BaseFee = tour.BaseFee,
                RevenuePerPax = pax > 0 ? Math.Round(grossRevenue / pax, 2) : 0,

                HotelCost = totalHotelCost,
                HotelCostPerPax = pax > 0 ? Math.Round(totalHotelCost / pax, 2) : 0,
                HotelCostPerPaxPerNight = (pax > 0 && nights > 0) ? Math.Round(totalHotelCost / (pax * nights), 2) : 0,
                HotelStayCount = hotelServices.Count,
                HotelNames = hotelNames,

                GuideCost = totalGuideCost,
                GuideCostPerPax = pax > 0 ? Math.Round(totalGuideCost / pax, 2) : 0,
                GuideName = leadGuide,
                GuideCommissionRate = tour.GuideCommission > 0 ? tour.GuideCommission : 10.00m,

                TransportCost = totalTransportCost,
                TransportCostPerPax = pax > 0 ? Math.Round(totalTransportCost / pax, 2) : 0,
                TransportCompanyOrDriver = transportDesc,

                ExcursionSales = totalExcursionSales,
                ExcursionSalesPerPax = pax > 0 ? Math.Round(totalExcursionSales / pax, 2) : 0,
                ExcursionCost = excursionCost,
                ExcursionNetMargin = totalExcursionSales - excursionCost,
                ExcursionCount = excursionServices.Count,

                OtherCost = totalOtherCost,
                TotalExpenses = totalExpenses,
                TotalCostPerPax = pax > 0 ? Math.Round(totalExpenses / pax, 2) : 0,

                NetMargin = netMargin,
                MarginPercent = Math.Round(marginPercent, 1),
                MarginPerPax = pax > 0 ? Math.Round(netMargin / pax, 2) : 0
            };
        }

        #region Tailored Comparison Renderers

        private AIChatResponse RenderHotelPriceComparison(
            Tour? targetTour,
            List<TourFinancialBenchmark> benchmarks,
            string cohortDescription)
        {
            // Focus on tours that have registered hotel costs
            var validTours = benchmarks.Where(b => b.HotelCost > 0).ToList();
            if (validTours.Count == 0) validTours = benchmarks;

            var avgHotelCost = validTours.Average(b => b.HotelCost);
            var avgHotelPerPax = validTours.Average(b => b.HotelCostPerPax);
            var avgHotelPerPaxNight = validTours.Average(b => b.HotelCostPerPaxPerNight);

            var targetBm = targetTour != null
                ? (benchmarks.FirstOrDefault(b => b.TourId == targetTour.Id) ?? benchmarks.FirstOrDefault())
                : benchmarks.OrderBy(b => b.HotelCostPerPax).FirstOrDefault();

            string standingSnippet = "";
            if (targetBm != null && validTours.Count > 1)
            {
                var diff = targetBm.HotelCostPerPax - avgHotelPerPax;
                var pctDiff = avgHotelPerPax > 0 ? (diff / avgHotelPerPax) * 100m : 0m;
                var rank = validTours.OrderBy(b => b.HotelCostPerPax).ToList().IndexOf(targetBm) + 1;

                standingSnippet = $"### 📊 Comparative Analysis & Ranking\n" +
                                  $"• **Target Tour (`{targetBm.TourCode}`)**: **`€{targetBm.HotelCostPerPax:N2} / pax`** (`€{targetBm.HotelCostPerPaxPerNight:N2} / night`)\n" +
                                  $"• **Cohort Average**: **`€{avgHotelPerPax:N2} / pax`** (`€{avgHotelPerPaxNight:N2} / night`)\n" +
                                  $"• **Variance vs Average**: " + (diff < 0 
                                      ? $"🟢 **`-€{Math.Abs(diff):N2} / pax` ({pctDiff:F1}% lower)** — Cost Efficient!" 
                                      : $"🔴 **`+€{diff:N2} / pax` (+{pctDiff:F1}% higher)** — Review Contracting Rates.") + "\n" +
                                  $"• **Cohort Standing**: 🏅 Ranked **#{rank} of {validTours.Count}** tours (lowest hotel price/pax).\n\n";
            }

            // Build Markdown Comparison Table
            var rows = validTours.OrderBy(b => b.HotelCostPerPax).Select(b =>
            {
                var isTarget = targetBm != null && b.TourId == targetBm.TourId;
                var marker = isTarget ? "🎯 " : "";
                var diff = b.HotelCostPerPax - avgHotelPerPax;
                var pct = avgHotelPerPax > 0 ? (diff / avgHotelPerPax) * 100m : 0m;
                var varBadge = diff == 0 ? "—" : (diff < 0 ? $"🟢 `{pct:F1}%`" : $"🔴 `+{pct:F1}%`");

                return $"| {marker}**{b.TourCode}** | `{b.ArrivalDate:dd/MM}` ➔ `{b.EndDate:dd/MM}` | `{b.Pax}` | `{b.Nights}` | `€{b.HotelCost:N2}` | **`€{b.HotelCostPerPax:N2}`** | `€{b.HotelCostPerPaxPerNight:N2}` | {varBadge} |";
            });

            var table = "| Tour Code | Dates | Pax | Nts | Total Hotel Cost | Hotel Cost / Pax | Cost / Pax / Night | Variance vs Avg |\n" +
                        "| :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- |\n" +
                        string.Join("\n", rows) + "\n" +
                        $"| **Monthly Average** | — | `{Math.Round(validTours.Average(b => b.Pax))}` | `{Math.Round(validTours.Average(b => b.Nights))}` | `€{avgHotelCost:N2}` | **`€{avgHotelPerPax:N2}`** | `€{avgHotelPerPaxNight:N2}` | Baseline |";

            var insights = "### 💡 Key Commercial Insights\n";
            if (targetBm != null && targetBm.Pax >= 35)
            {
                insights += $"1. **Pax Economy of Scale**: With `{targetBm.Pax}` passengers, `{targetBm.TourCode}` optimizes Double/Twin room occupancy, substantially reducing per-passenger hotel overhead.\n";
            }
            else
            {
                insights += "1. **Room Occupancy Factor**: Tours with higher passenger counts achieve better room density and negotiate lower contracted group rates.\n";
            }
            insights += $"2. **Nightly Rate Comparison**: The average nightly accommodation cost across this cohort is `€{avgHotelPerPaxNight:N2}/pax/night`.\n" +
                        $"3. **Procurement Tip**: Inquire with primary hotels for single-supplement waivers when operating multiple departures within the same calendar month.";

            var answer = $"👋 **Hotel Price per Pax Benchmark & Comparison**:\n\n" +
                         $"📅 **Cohort Scope**: {cohortDescription} (`{validTours.Count}` Tours Compared)\n\n" +
                         standingSnippet +
                         "### 📋 Hotel Price / Pax Comparison Table\n" +
                         table + "\n\n" +
                         insights;

            var links = new List<QuickActionLink>();
            if (targetBm != null)
            {
                links.Add(new QuickActionLink { Label = $"Open {targetBm.TourCode} Costing", Path = $"/projects/{targetBm.ProjectId}/tours/{targetBm.TourId}" });
            }
            links.Add(new QuickActionLink { Label = "View Master Data Hotels", Path = "/master-data" });

            return new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = answer,
                RecommendedLinks = links,
                SuggestedPills = new List<string>
                {
                    targetBm != null ? $"Compare total expenses for {targetBm.TourCode}" : "Compare tour expenses",
                    targetBm != null ? $"Compare excursion sales/pax for {targetBm.TourCode}" : "Compare excursion sales",
                    targetBm != null ? $"Compare total revenue for {targetBm.TourCode}" : "Compare revenue and margin",
                    "Executive KPI Dashboard"
                }
            };
        }

        private async Task<AIChatResponse> RenderHeadToHeadComparisonAsync(Tour tourA, Tour tourB, string q)
        {
            var svcList = await _context.TourServices
                .Include(s => s.ServiceCategory)
                .Where(s => s.TourId == tourA.Id || s.TourId == tourB.Id)
                .ToListAsync();

            var hotels = await _context.Hotels.ToListAsync();
            var guides = await _context.Guides.ToListAsync();
            var bookings = await _context.Bookings.Where(b => b.TourId == tourA.Id || b.TourId == tourB.Id).ToListAsync();

            var bmA = ComputeTourBenchmark(tourA, svcList.Where(s => s.TourId == tourA.Id).ToList(), hotels, guides, bookings.Where(b => b.TourId == tourA.Id).ToList());
            var bmB = ComputeTourBenchmark(tourB, svcList.Where(s => s.TourId == tourB.Id).ToList(), hotels, guides, bookings.Where(b => b.TourId == tourB.Id).ToList());

            var revDiff = bmA.GrossRevenue - bmB.GrossRevenue;
            var hotelPaxDiff = bmA.HotelCostPerPax - bmB.HotelCostPerPax;
            var expPaxDiff = bmA.TotalCostPerPax - bmB.TotalCostPerPax;
            var marginDiff = bmA.MarginPercent - bmB.MarginPercent;

            string revLeader = revDiff >= 0 ? $"🟢 {bmA.TourCode}" : $"🟢 {bmB.TourCode}";
            string hotelLeader = hotelPaxDiff <= 0 ? $"🟢 {bmA.TourCode} (Cheaper)" : $"🟢 {bmB.TourCode} (Cheaper)";
            string marginLeader = marginDiff >= 0 ? $"🟢 {bmA.TourCode}" : $"🟢 {bmB.TourCode}";

            var table = "| Financial / Operational Metric | " + $"{bmA.TourCode} ({bmA.Pax} Pax)" + " | " + $"{bmB.TourCode} ({bmB.Pax} Pax)" + " | Variance (Δ) | Efficiency Leader |\n" +
                        "| :--- | :--- | :--- | :--- | :--- |\n" +
                        $"| **Gross Package Revenue** | `€{bmA.GrossRevenue:N2}` | `€{bmB.GrossRevenue:N2}` | `{(revDiff >= 0 ? "+" : "")}€{revDiff:N2}` | {revLeader} |\n" +
                        $"| **Revenue / Pax** | `€{bmA.RevenuePerPax:N2}` | `€{bmB.RevenuePerPax:N2}` | `{(bmA.RevenuePerPax - bmB.RevenuePerPax >= 0 ? "+" : "")}€{(bmA.RevenuePerPax - bmB.RevenuePerPax):N2}` | — |\n" +
                        $"| **Hotel Accommodations Total** | `€{bmA.HotelCost:N2}` | `€{bmB.HotelCost:N2}` | `{(bmA.HotelCost - bmB.HotelCost >= 0 ? "+" : "")}€{(bmA.HotelCost - bmB.HotelCost):N2}` | — |\n" +
                        $"| **Hotel Cost / Pax** | **`€{bmA.HotelCostPerPax:N2}`** | **`€{bmB.HotelCostPerPax:N2}`** | `{(hotelPaxDiff >= 0 ? "+" : "")}€{hotelPaxDiff:N2}` | {hotelLeader} |\n" +
                        $"| **Hotel Cost / Pax / Night** | `€{bmA.HotelCostPerPaxPerNight:N2}` | `€{bmB.HotelCostPerPaxPerNight:N2}` | `{(bmA.HotelCostPerPaxPerNight - bmB.HotelCostPerPaxPerNight >= 0 ? "+" : "")}€{(bmA.HotelCostPerPaxPerNight - bmB.HotelCostPerPaxPerNight):N2}` | — |\n" +
                        $"| **Lead Guide Remuneration** | `€{bmA.GuideCost:N2}` | `€{bmB.GuideCost:N2}` | `€{(bmA.GuideCost - bmB.GuideCost):N2}` | `{bmA.GuideName}` vs `{bmB.GuideName}` |\n" +
                        $"| **Coach Transport & Driver** | `€{bmA.TransportCost:N2}` | `€{bmB.TransportCost:N2}` | `€{(bmA.TransportCost - bmB.TransportCost):N2}` | — |\n" +
                        $"| **Optional Excursion Sales** | `€{bmA.ExcursionSales:N2}` | `€{bmB.ExcursionSales:N2}` | `€{(bmA.ExcursionSales - bmB.ExcursionSales):N2}` | — |\n" +
                        $"| **Excursion Sales / Pax** | `€{bmA.ExcursionSalesPerPax:N2}` | `€{bmB.ExcursionSalesPerPax:N2}` | `€{(bmA.ExcursionSalesPerPax - bmB.ExcursionSalesPerPax):N2}` | — |\n" +
                        $"| **Total Operating Expenses** | `€{bmA.TotalExpenses:N2}` | `€{bmB.TotalExpenses:N2}` | `€{(bmA.TotalExpenses - bmB.TotalExpenses):N2}` | — |\n" +
                        $"| **Total Cost / Pax** | **`€{bmA.TotalCostPerPax:N2}`** | **`€{bmB.TotalCostPerPax:N2}`** | `{(expPaxDiff >= 0 ? "+" : "")}€{expPaxDiff:N2}` | {(expPaxDiff <= 0 ? $"🟢 {bmA.TourCode}" : $"🟢 {bmB.TourCode}")} |\n" +
                        $"| **Net Profit Margin (€)** | **`€{bmA.NetMargin:N2}`** | **`€{bmB.NetMargin:N2}`** | `€{(bmA.NetMargin - bmB.NetMargin):N2}` | {marginLeader} |\n" +
                        $"| **Profit Margin (%)** | **`{bmA.MarginPercent:F1}%`** | **`{bmB.MarginPercent:F1}%`** | `{(marginDiff >= 0 ? "+" : "")}{marginDiff:F1}%` | {marginLeader} |\n" +
                        $"| **Excursion Guide Comm %** | `{bmA.GuideCommissionRate:F1}%` | `{bmB.GuideCommissionRate:F1}%` | — | Equal Rate |";

            var answer = $"👋 **Head-to-Head Tour Comparison: `{bmA.TourCode}` vs `{bmB.TourCode}`**:\n\n" +
                         $"• **{bmA.TourCode}**: `{bmA.Destination}` | `{bmA.ArrivalDate:dd/MM/yyyy}` ➔ `{bmA.EndDate:dd/MM/yyyy}` ({bmA.Pax} Pax)\n" +
                         $"• **{bmB.TourCode}**: `{bmB.Destination}` | `{bmB.ArrivalDate:dd/MM/yyyy}` ➔ `{bmB.EndDate:dd/MM/yyyy}` ({bmB.Pax} Pax)\n\n" +
                         "### ⚖️ Side-by-Side Financial & Operational Breakdown\n" +
                         table + "\n\n" +
                         "### 💡 Comparative Commercial Summary\n" +
                         $"• **Hotel Efficiency**: `{bmA.TourCode}` operates at `€{bmA.HotelCostPerPax:N2}/pax` vs `{bmB.TourCode}` at `€{bmB.HotelCostPerPax:N2}/pax` (diff: `€{Math.Abs(hotelPaxDiff):N2}/pax`).\n" +
                         $"• **Margin Performance**: {marginLeader} achieves higher profitability with `{Math.Max(bmA.MarginPercent, bmB.MarginPercent):F1}%` net margin.\n" +
                         $"• **Group Volume Impact**: Group scale differences ({bmA.Pax} vs {bmB.Pax} pax) directly drive operational supplier efficiencies.";

            return new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = answer,
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = $"Inspect {bmA.TourCode}", Path = $"/projects/{bmA.ProjectId}/tours/{bmA.TourId}" },
                    new QuickActionLink { Label = $"Inspect {bmB.TourCode}", Path = $"/projects/{bmB.ProjectId}/tours/{bmB.TourId}" }
                },
                SuggestedPills = new List<string>
                {
                    $"Hotel stays for {bmA.TourCode}",
                    $"Hotel stays for {bmB.TourCode}",
                    $"How to proceed with {bmA.TourCode}?",
                    "Executive KPI Dashboard"
                }
            };
        }

        private AIChatResponse RenderOperationalExpensesComparison(
            Tour? targetTour,
            List<TourFinancialBenchmark> benchmarks,
            string cohortDescription)
        {
            var avgHotel = benchmarks.Average(b => b.HotelCostPerPax);
            var avgTransport = benchmarks.Average(b => b.TransportCostPerPax);
            var avgGuide = benchmarks.Average(b => b.GuideCostPerPax);
            var avgTotalCostPerPax = benchmarks.Average(b => b.TotalCostPerPax);

            var rows = benchmarks.OrderBy(b => b.TotalCostPerPax).Select(b =>
            {
                var isTarget = targetTour != null && b.TourId == targetTour.Id;
                var marker = isTarget ? "🎯 " : "";
                return $"| {marker}**{b.TourCode}** | `{b.Pax}` | `€{b.HotelCost:N2}` | `€{b.GuideCost:N2}` | `€{b.TransportCost:N2}` | `€{b.OtherCost:N2}` | `€{b.TotalExpenses:N2}` | **`€{b.TotalCostPerPax:N2}`** |";
            });

            var table = "| Tour Code | Pax | Hotel Total | Guide Total | Transport | Other | Total Cost | Total Cost / Pax |\n" +
                        "| :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- |\n" +
                        string.Join("\n", rows) + "\n" +
                        $"| **Cohort Average** | `{Math.Round(benchmarks.Average(b => b.Pax))}` | `€{benchmarks.Average(b => b.HotelCost):N2}` | `€{benchmarks.Average(b => b.GuideCost):N2}` | `€{benchmarks.Average(b => b.TransportCost):N2}` | `€{benchmarks.Average(b => b.OtherCost):N2}` | `€{benchmarks.Average(b => b.TotalExpenses):N2}` | **`€{avgTotalCostPerPax:N2}`** |";

            var answer = $"👋 **Operational Expenses & Cost Breakdown Comparison**:\n\n" +
                         $"📅 **Cohort Scope**: {cohortDescription} (`{benchmarks.Count}` Tours Compared)\n\n" +
                         "### 📋 Cost Breakdown by Supplier Category\n" +
                         table + "\n\n" +
                         "### 💡 Expense Distribution Insights\n" +
                         $"• **Hotel Accommodation**: Represents the largest expense item, averaging `€{avgHotel:N2}/pax`.\n" +
                         $"• **Transport & Logistics**: Averages `€{avgTransport:N2}/pax` for coach charter and airport transfers.\n" +
                         $"• **Guide Remuneration**: Averages `€{avgGuide:N2}/pax`.\n" +
                         $"• **Combined Cost Benchmark**: Average total operational delivery cost is **`€{avgTotalCostPerPax:N2}/pax`**.";

            return new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = answer,
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = "Open Tours Operations", Path = "/tours" }
                },
                SuggestedPills = new List<string>
                {
                    "Compare hotelprice/pax across tours",
                    "Compare excursion sales/pax",
                    "Compare total revenue and margin",
                    "Executive KPI Dashboard"
                }
            };
        }

        private AIChatResponse RenderExcursionSalesComparison(
            Tour? targetTour,
            List<TourFinancialBenchmark> benchmarks,
            string cohortDescription)
        {
            var avgSalesPerPax = benchmarks.Average(b => b.ExcursionSalesPerPax);
            var avgCommRate = benchmarks.Average(b => b.GuideCommissionRate);

            var rows = benchmarks.OrderByDescending(b => b.ExcursionSalesPerPax).Select(b =>
            {
                var isTarget = targetTour != null && b.TourId == targetTour.Id;
                var marker = isTarget ? "🎯 " : "";
                var estComm = b.ExcursionSales * (b.GuideCommissionRate / 100m);
                return $"| {marker}**{b.TourCode}** | `{b.Pax}` | `€{b.ExcursionSales:N2}` | **`€{b.ExcursionSalesPerPax:N2}`** | `{b.GuideCommissionRate:F1}%` | `€{estComm:N2}` | `€{b.ExcursionNetMargin:N2}` |";
            });

            var table = "| Tour Code | Pax | Excursion Revenue | Sales / Pax | Guide Comm % | Est Guide Comm | Net Excursion Margin |\n" +
                        "| :--- | :---: | :--- | :--- | :---: | :--- | :--- |\n" +
                        string.Join("\n", rows) + "\n" +
                        $"| **Cohort Average** | `{Math.Round(benchmarks.Average(b => b.Pax))}` | `€{benchmarks.Average(b => b.ExcursionSales):N2}` | **`€{avgSalesPerPax:N2}`** | `{avgCommRate:F1}%` | `€{benchmarks.Average(b => b.ExcursionSales * (b.GuideCommissionRate / 100m)):N2}` | `€{benchmarks.Average(b => b.ExcursionNetMargin):N2}` |";

            var answer = $"👋 **Excursion Sales & Guide Commission Benchmark**:\n\n" +
                         $"📅 **Cohort Scope**: {cohortDescription} (`{benchmarks.Count}` Tours Compared)\n\n" +
                         "### 🎡 Optional Excursion Commercial Performance\n" +
                         table + "\n\n" +
                         "### 💡 Commercial Takeaways\n" +
                         $"• **Average Excursion Sales**: Groups generate an average of `€{avgSalesPerPax:N2} / pax` in optional tour revenue.\n" +
                         $"• **Commission Standard**: Standard guide commission is `{avgCommRate:F1}%`, retained from on-ground cash collections.\n" +
                         "• **Margin Driver**: Excursion packages carry minimal additional fixed costs, significantly expanding net operational margins.";

            return new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = answer,
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = "View Master Data Excursions", Path = "/master-data" }
                },
                SuggestedPills = new List<string>
                {
                    "Compare hotelprice/pax across tours",
                    "Compare total expenses across tours",
                    "Executive KPI Dashboard"
                }
            };
        }

        private AIChatResponse RenderRevenueAndMarginComparison(
            Tour? targetTour,
            List<TourFinancialBenchmark> benchmarks,
            string cohortDescription)
        {
            var avgRevPerPax = benchmarks.Average(b => b.RevenuePerPax);
            var avgMarginPct = benchmarks.Average(b => b.MarginPercent);
            var avgNetMargin = benchmarks.Average(b => b.NetMargin);

            var rows = benchmarks.OrderByDescending(b => b.MarginPercent).Select(b =>
            {
                var isTarget = targetTour != null && b.TourId == targetTour.Id;
                var marker = isTarget ? "🎯 " : "";
                var badge = b.MarginPercent >= 20 ? "🟢" : (b.MarginPercent >= 10 ? "🟡" : "🔴");
                return $"| {marker}**{b.TourCode}** | `{b.Pax}` | `€{b.GrossRevenue:N2}` | **`€{b.RevenuePerPax:N2}`** | `€{b.TotalExpenses:N2}` | `€{b.NetMargin:N2}` | {badge} **`{b.MarginPercent:F1}%`** |";
            });

            var table = "| Tour Code | Pax | Gross Revenue | Revenue / Pax | Total Expenses | Net Margin (€) | Margin (%) |\n" +
                        "| :--- | :---: | :--- | :--- | :--- | :--- | :--- |\n" +
                        string.Join("\n", rows) + "\n" +
                        $"| **Cohort Average** | `{Math.Round(benchmarks.Average(b => b.Pax))}` | `€{benchmarks.Average(b => b.GrossRevenue):N2}` | **`€{avgRevPerPax:N2}`** | `€{benchmarks.Average(b => b.TotalExpenses):N2}` | `€{avgNetMargin:N2}` | **`{avgMarginPct:F1}%`** |";

            var answer = $"👋 **Commercial Revenue & Net Profit Margin Benchmark**:\n\n" +
                         $"📅 **Cohort Scope**: {cohortDescription} (`{benchmarks.Count}` Tours Compared)\n\n" +
                         "### 💶 Revenue vs Profit Margin Ranking\n" +
                         table + "\n\n" +
                         "### 💡 Commercial Takeaways\n" +
                         $"• **Average Revenue per Passenger**: `€{avgRevPerPax:N2} / pax` across this operational cohort.\n" +
                         $"• **Average Operational Margin**: Groups achieve an average net margin of **`{avgMarginPct:F1}%`** (`€{avgNetMargin:N2}`/tour).\n" +
                         "• **Margin Optimization**: Maximizing passenger counts while keeping hotel and coach charter fixed yields optimal operating margins.";

            return new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = answer,
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = "View Finance Overview", Path = "/finance" }
                },
                SuggestedPills = new List<string>
                {
                    "Compare hotelprice/pax across tours",
                    "Compare total expenses across tours",
                    "Compare excursion sales/pax",
                    "Executive KPI Dashboard"
                }
            };
        }

        private AIChatResponse RenderComprehensiveBenchmark(
            Tour? targetTour,
            List<TourFinancialBenchmark> benchmarks,
            string cohortDescription)
        {
            var rows = benchmarks.OrderByDescending(b => b.GrossRevenue).Select(b =>
            {
                var isTarget = targetTour != null && b.TourId == targetTour.Id;
                var marker = isTarget ? "🎯 " : "";
                return $"| {marker}**{b.TourCode}** | `{b.Pax}` | `€{b.RevenuePerPax:N2}` | `€{b.HotelCostPerPax:N2}` | `€{b.TotalCostPerPax:N2}` | `€{b.NetMargin:N2}` | `{b.MarginPercent:F1}%` |";
            });

            var table = "| Tour Code | Pax | Rev / Pax | Hotel / Pax | Cost / Pax | Net Margin (€) | Margin (%) |\n" +
                        "| :--- | :---: | :--- | :--- | :--- | :--- | :--- |\n" +
                        string.Join("\n", rows);

            var answer = $"👋 **Comprehensive Multi-Item Operational Benchmark**:\n\n" +
                         $"📅 **Cohort Scope**: {cohortDescription} (`{benchmarks.Count}` Tours Benchmarked)\n\n" +
                         "### 📊 Key Performance Indicator (KPI) Summary Table\n" +
                         table + "\n\n" +
                         "You can ask for specialized deep-dives into any entry:\n" +
                         "• *\"Compare hotelprice/pax with this tour and others in the same month\"*\n" +
                         "• *\"Compare excursion sales/pax across September tours\"*\n" +
                         "• *\"Compare total expenses and supplier costs\"*";

            return new AIChatResponse
            {
                Category = "Tours",
                Mode = "Live-DB-Entity-Lookup",
                Answer = answer,
                RecommendedLinks = new List<QuickActionLink>
                {
                    new QuickActionLink { Label = "Open Tours Board", Path = "/tours" }
                },
                SuggestedPills = new List<string>
                {
                    "Compare hotelprice/pax in the same month",
                    "Compare total expenses across tours",
                    "Compare excursion sales/pax",
                    "Compare total revenue and margin"
                }
            };
        }

        #endregion
    }
}
