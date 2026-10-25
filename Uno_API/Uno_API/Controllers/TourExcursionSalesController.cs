using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;

namespace Uno_API.Controllers
{
    [ApiController]
    [Route("api/tours/{tourId}/excursion-sales")]
    public class TourExcursionSalesController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public TourExcursionSalesController(UnoDbContext context)
        {
            _context = context;
        }

        // GET: api/tours/6128/excursion-sales
        [HttpGet]
        public async Task<IActionResult> GetExcursionSales(int tourId)
        {
            var tour = await _context.Tours
                .Include(t => t.Project)
                .Include(t => t.Passengers)
                .Include(t => t.TourServices)
                    .ThenInclude(ts => ts.ServiceCategory)
                .FirstOrDefaultAsync(t => t.Id == tourId);

            if (tour == null)
            {
                return NotFound(new { error = $"Tour #{tourId} not found." });
            }

            // Determine Guide Name
            string guideName = "Unassigned Guide";
            var guideService = tour.TourServices.FirstOrDefault(ts => 
                ts.GuideId.HasValue || 
                ts.ServiceCategoryId == 4 || 
                (ts.ServiceCategory?.Name != null && ts.ServiceCategory.Name.ToLower().Contains("guide")));

            if (guideService != null)
            {
                if (guideService.GuideId.HasValue)
                {
                    var g = await _context.Guides.FindAsync(guideService.GuideId.Value);
                    if (g != null && !string.IsNullOrWhiteSpace(g.Name))
                    {
                        guideName = g.Name;
                    }
                }
                if (guideName == "Unassigned Guide" && !string.IsNullOrWhiteSpace(guideService.Description))
                {
                    guideName = guideService.Description.Replace("Guide:", "").Trim();
                }
            }

            // Base Commission Rate
            decimal commissionRate = tour.GuideCommission > 0 ? tour.GuideCommission : 10.00m;

            // Load all available master excursions
            var allExcursions = await _context.Excursions
                .OrderBy(e => e.Id)
                .ToListAsync();

            // Load existing sales for this tour
            var existingSales = await _context.TourExcursionSales
                .Where(s => s.TourId == tourId)
                .ToListAsync();

            var salesByExcursion = existingSales.GroupBy(s => s.ExcursionId).ToDictionary(g => g.Key, g => g.Count());

            // Build excursion catalog list with selection flag
            // Default select excursions that either have existing sales OR match standard top destination excursions
            var excursionsList = allExcursions.Select(e =>
            {
                decimal effectivePrice = e.SalePrice > 0 ? e.SalePrice : (e.Price > 0 ? e.Price : 35.00m);
                string code = !string.IsNullOrWhiteSpace(e.TourCode) ? e.TourCode : (!string.IsNullOrWhiteSpace(e.Name) ? e.Name : $"EXC-{e.Id}");
                bool isSelected = salesByExcursion.ContainsKey(e.Id) || 
                                  code == "BDP-Boat" || code == "PRG-KV" || code == "VN-Hallst" || code == "PRG-Folk" ||
                                  e.Name.ToLower().Contains("danube") || e.Name.ToLower().Contains("karlovy") ||
                                  e.Name.ToLower().Contains("hallstatt") || e.Name.ToLower().Contains("folklore");

                return new
                {
                    id = e.Id,
                    name = e.Name,
                    code = code,
                    type = e.Type ?? "Excursion",
                    price = e.Price,
                    salePrice = effectivePrice,
                    isSelected = isSelected,
                    soldCount = salesByExcursion.ContainsKey(e.Id) ? salesByExcursion[e.Id] : 0
                };
            }).ToList();

            // Build passenger rooming list
            var passengers = (tour.Passengers ?? new List<Passenger>())
                .OrderBy(p => p.RoomNumber ?? 999)
                .ThenBy(p => p.LastName)
                .ThenBy(p => p.FirstName)
                .Select(p =>
                {
                    string roomStr = p.RoomNumber.HasValue 
                        ? $"{(string.IsNullOrWhiteSpace(p.RoomType) ? "Room" : p.RoomType)} #{p.RoomNumber}"
                        : (!string.IsNullOrWhiteSpace(p.RoomType) ? p.RoomType : "Room TBD");

                    string paxType = PassengerAgeHelper.HasPaxClassification(p.DateOfBirth, p.PaxType)
                        ? PassengerAgeHelper.DeterminePaxType(p.DateOfBirth, p.PaxType, DateTime.Today)
                        : "Adult";
                    bool isChild = string.Equals(paxType, "Children", StringComparison.OrdinalIgnoreCase);
                    bool isInfant = string.Equals(paxType, "Infant", StringComparison.OrdinalIgnoreCase);

                    return new
                    {
                        id = p.Id,
                        name = string.IsNullOrWhiteSpace(p.Name) ? $"{p.FirstName} {p.LastName}".Trim() : p.Name,
                        firstName = p.FirstName,
                        lastName = p.LastName,
                        room = roomStr,
                        roomNumber = p.RoomNumber,
                        roomType = p.RoomType,
                        paxType = paxType,
                        isChild = isChild,
                        isInfant = isInfant
                    };
                }).ToList();

            bool isSettled = existingSales.Any(s => s.IsSettled);
            DateTime? settledAt = existingSales.FirstOrDefault(s => s.SettledAt.HasValue)?.SettledAt;
            string? settledBy = existingSales.FirstOrDefault(s => !string.IsNullOrEmpty(s.SettledBy))?.SettledBy;

            return Ok(new
            {
                tourId = tour.Id,
                tourCode = tour.TourCode,
                destination = tour.Destination,
                projectCode = tour.Project?.ProjectCode ?? $"PRJ-{tour.ProjectId}",
                projectName = tour.Project?.Description ?? "",
                guideName = guideName,
                guideCommissionRate = commissionRate,
                paxCount = passengers.Count > 0 ? passengers.Count : tour.Pax,
                isSettled = isSettled,
                settledAt = settledAt,
                settledBy = settledBy,
                passengers = passengers,
                excursions = excursionsList,
                sales = existingSales.Select(s => new
                {
                    id = s.Id,
                    passengerId = s.PassengerId,
                    excursionId = s.ExcursionId,
                    unitPrice = s.UnitPrice,
                    paymentMethod = s.PaymentMethod,
                    isSettled = s.IsSettled
                })
            });
        }

        // POST: api/tours/6128/excursion-sales/bulk-settlement
        [HttpPost("bulk-settlement")]
        public async Task<IActionResult> BulkSettlement(int tourId, [FromBody] BulkSettlementRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { error = "Request payload cannot be empty." });
            }

            var tour = await _context.Tours
                .Include(t => t.Passengers)
                .Include(t => t.TourServices)
                .FirstOrDefaultAsync(t => t.Id == tourId);

            if (tour == null)
            {
                return NotFound(new { error = $"Tour #{tourId} not found." });
            }

            try
            {
                // 1. Clear existing sales for this tour to avoid orphaned records
                var currentSales = await _context.TourExcursionSales
                    .Where(s => s.TourId == tourId)
                    .ToListAsync();

                if (currentSales.Any())
                {
                    _context.TourExcursionSales.RemoveRange(currentSales);
                }

                // 2. Add new sales records with server-side age-based discount enforcement
                var now = DateTime.UtcNow;
                string settler = !string.IsNullOrWhiteSpace(request.SettledBy) ? request.SettledBy.Trim() : "Guide";

                var tourPassengers = (tour.Passengers ?? new List<Passenger>()).ToDictionary(p => p.Id, p => p);
                var excursionsDict = await _context.Excursions.ToDictionaryAsync(e => e.Id, e => e);

                var newSales = new List<TourExcursionSale>();
                foreach (var item in request.Sales)
                {
                    decimal effectiveUnitPrice = item.UnitPrice;

                    // Enforce business rules: Children get 50% discount, Infant is free
                    if (tourPassengers.TryGetValue(item.PassengerId, out var p) && excursionsDict.TryGetValue(item.ExcursionId, out var exc))
                    {
                        string pType = PassengerAgeHelper.HasPaxClassification(p.DateOfBirth, p.PaxType)
                            ? PassengerAgeHelper.DeterminePaxType(p.DateOfBirth, p.PaxType, DateTime.Today)
                            : "Adult";
                        decimal basePrice = exc.SalePrice > 0 ? exc.SalePrice : (exc.Price > 0 ? exc.Price : 35.00m);

                        if (string.Equals(pType, "Infant", StringComparison.OrdinalIgnoreCase))
                        {
                            effectiveUnitPrice = 0.00m; // Infant is free
                        }
                        else if (string.Equals(pType, "Children", StringComparison.OrdinalIgnoreCase))
                        {
                            effectiveUnitPrice = Math.Round(basePrice * 0.5m, 2); // Children 50% discount
                        }
                        else
                        {
                            // Adult: default to basePrice if <= 0
                            if (effectiveUnitPrice <= 0)
                            {
                                effectiveUnitPrice = basePrice;
                            }
                        }
                    }

                    newSales.Add(new TourExcursionSale
                    {
                        TourId = tourId,
                        PassengerId = item.PassengerId,
                        ExcursionId = item.ExcursionId,
                        UnitPrice = effectiveUnitPrice,
                        PaymentMethod = !string.IsNullOrWhiteSpace(item.PaymentMethod) ? item.PaymentMethod : "Cash EUR",
                        IsSettled = true,
                        CreatedAt = now,
                        SettledAt = now,
                        SettledBy = settler
                    });
                }

                if (newSales.Any())
                {
                    _context.TourExcursionSales.AddRange(newSales);
                }

                // 3. Compute exact totals & synchronize revenue TourServices for Excursions
                decimal computedGross = newSales.Sum(s => s.UnitPrice);
                decimal commRate = (tour.GuideCommission > 0 ? tour.GuideCommission : 10.00m) / 100m;
                decimal computedCommission = Math.Round(computedGross * commRate, 2);
                decimal computedNet = computedGross - computedCommission;

                var salesByExcursion = newSales.GroupBy(s => s.ExcursionId).ToList();

                // Find existing excursion revenue services in this tour
                var existingExcServices = await _context.TourServices
                    .Where(ts => ts.TourId == tourId && ts.ServiceCategoryId == 6 && ts.IsRevenue == true)
                    .ToListAsync();

                foreach (var group in salesByExcursion)
                {
                    int excId = group.Key;
                    int soldCount = group.Count();
                    decimal totalAmount = group.Sum(s => s.UnitPrice);
                    decimal avgUnitPrice = soldCount > 0 ? Math.Round(totalAmount / soldCount, 2) : 0m;

                    var exc = excursionsDict.ContainsKey(excId) ? excursionsDict[excId] : await _context.Excursions.FindAsync(excId);
                    string excName = exc?.Name ?? $"Excursion #{excId}";

                    var matchService = existingExcServices.FirstOrDefault(ts => ts.ExcursionId == excId || ts.Description.Equals(excName, StringComparison.OrdinalIgnoreCase));
                    if (matchService != null)
                    {
                        matchService.Quantity = soldCount;
                        matchService.UnitPrice = avgUnitPrice;
                        matchService.TotalAmount = totalAmount;
                        matchService.ExcursionId = excId;
                    }
                    else
                    {
                        _context.TourServices.Add(new TourService
                        {
                            TourId = tourId,
                            ServiceCategoryId = 6, // Excursion
                            Description = excName,
                            Quantity = soldCount,
                            UnitPrice = avgUnitPrice,
                            TotalAmount = totalAmount,
                            IsRevenue = true,
                            ExcursionId = excId
                        });
                    }
                }

                // Remove excursion services that had 0 sales if they were previous settlements
                var activeExcIds = salesByExcursion.Select(g => g.Key).ToHashSet();
                foreach (var oldSvc in existingExcServices)
                {
                    if (oldSvc.ExcursionId.HasValue && !activeExcIds.Contains(oldSvc.ExcursionId.Value))
                    {
                        _context.TourServices.Remove(oldSvc);
                    }
                }

                // 4. Record Audit Log Entry
                string voucherNo = $"GS-{tourId}-{DateTime.UtcNow:yyyyMMdd}";
                var userRole = Request.Headers["X-User-Role"].FirstOrDefault() ?? "Guide";
                var userName = Request.Headers["X-User-Name"].FirstOrDefault() ?? settler;

                var auditLog = new AuditLog
                {
                    UserId = 1,
                    UserName = userName,
                    UserEmail = "guide@uno-dmc.cz",
                    UserRole = userRole,
                    Action = "GUIDE_SETTLEMENT",
                    EntityName = "Tour",
                    EntityId = tourId.ToString(),
                    Summary = $"Guide excursion settlement voucher #{voucherNo} submitted by {settler}: {newSales.Count} excursion tickets sold, Gross Revenue €{computedGross:F2}, Guide Commission €{computedCommission:F2}, Net Cash €{computedNet:F2}.",
                    Timestamp = now
                };
                _context.AuditLogs.Add(auditLog);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    voucherNo = voucherNo,
                    settledAt = now,
                    settledBy = settler,
                    totalTickets = newSales.Count,
                    totalGross = computedGross,
                    guideCommission = computedCommission,
                    netCashHandover = computedNet,
                    message = $"Settlement submitted successfully! Database updated & accounting voucher #{voucherNo} generated."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to submit guide settlement.", details = ex.Message });
            }
        }

        // DELETE: api/tours/6128/excursion-sales/reset
        [HttpDelete("reset")]
        public async Task<IActionResult> ResetSettlement(int tourId)
        {
            var sales = await _context.TourExcursionSales.Where(s => s.TourId == tourId).ToListAsync();
            if (sales.Any())
            {
                _context.TourExcursionSales.RemoveRange(sales);
                await _context.SaveChangesAsync();
            }
            return Ok(new { success = true, message = $"Excursion sales for Tour #{tourId} have been reset." });
        }
    }

    public class BulkSettlementRequest
    {
        public string SettledBy { get; set; } = string.Empty;
        public List<ExcursionSaleItemDto> Sales { get; set; } = new();
        public List<int>? SelectedExcursionIds { get; set; }
        public decimal TotalGross { get; set; }
        public decimal GuideCommission { get; set; }
        public decimal NetCashHandover { get; set; }
    }

    public class ExcursionSaleItemDto
    {
        public int PassengerId { get; set; }
        public int ExcursionId { get; set; }
        public decimal UnitPrice { get; set; }
        public string PaymentMethod { get; set; } = "Cash EUR";
    }
}
