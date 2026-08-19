using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourStatusCheckpointsController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public TourStatusCheckpointsController(UnoDbContext context)
        {
            _context = context;
        }

        // GET: api/TourStatusCheckpoints
        [HttpGet]
        public async Task<IActionResult> GetCheckpoints([FromQuery] int? targetStatusId)
        {
            var query = _context.TourStatusCheckpoints.Include(c => c.TargetStatus).AsQueryable();
            if (targetStatusId.HasValue)
            {
                query = query.Where(c => c.TargetStatusId == targetStatusId.Value);
            }
            return Ok(await query.ToListAsync());
        }

        // GET: api/TourStatusCheckpoints/evaluate/5
        [HttpGet("evaluate/{tourId}")]
        public async Task<IActionResult> EvaluateTourCheckpoints(int tourId, [FromQuery] int? targetStatusId)
        {
            var tour = await _context.Tours
                .Include(t => t.TourStatus)
                .Include(t => t.TourServices!)
                    .ThenInclude(ts => ts.ServiceCategory)
                .FirstOrDefaultAsync(t => t.Id == tourId);

            if (tour == null) return NotFound("Tour not found");

            int targetStatus = targetStatusId ?? (tour.TourStatusId + 1);
            if (targetStatus > 5) targetStatus = 5;

            var metadataCheckpoints = await _context.TourStatusCheckpoints
                .Where(c => c.TargetStatusId == targetStatus)
                .ToListAsync();

            var evaluationResults = new List<object>();
            bool canAdvance = true;
            int missingMandatoryCount = 0;

            foreach (var chk in metadataCheckpoints)
            {
                bool isSatisfied = false;
                string reason = "";

                switch (chk.CheckpointKey)
                {
                    case "PROJECT_DEFINED":
                        isSatisfied = tour.ProjectId > 0 && !string.IsNullOrEmpty(tour.Destination);
                        reason = isSatisfied ? "Project and destination city routing defined" : "Project or destination missing";
                        break;

                    case "HOTEL_RESERVATIONS_CONFIRMED":
                        var hasHotelSvc = tour.TourServices.Any(s => s.HotelId != null || s.ServiceCategory?.Name == "Hotel");
                        isSatisfied = hasHotelSvc;
                        reason = isSatisfied ? "Hotel reservations confirmed" : "No hotel service assigned to tour";
                        break;

                    case "GUIDE_ASSIGNED_CONFIRMED":
                        var hasGuideSvc = tour.TourServices.Any(s => s.GuideId != null || s.ServiceCategory?.Name == "Guide");
                        isSatisfied = hasGuideSvc;
                        reason = isSatisfied ? "Primary guide assigned & contract locked" : "No guide assigned to tour";
                        break;

                    case "TRANSPORT_CONFIRMED":
                        var hasTransportSvc = tour.TourServices.Any(s => s.DriverId != null || s.TransportCompanyId != null || s.ServiceCategory?.Name == "Transport" || s.ServiceCategory?.Name == "Driver");
                        isSatisfied = hasTransportSvc;
                        reason = isSatisfied ? "Transport company / driver assigned" : "No transport/driver service assigned";
                        break;

                    case "CLIENT_DEPOSIT_CONFIRMED":
                        isSatisfied = tour.TotalFee > 0 || tour.BaseFee > 0;
                        reason = isSatisfied ? "Client contract active & package pricing locked" : "Pricing / package fee not calculated";
                        break;

                    case "ARRIVAL_DATE_REACHED":
                        isSatisfied = DateTime.UtcNow >= tour.ArrivalDate;
                        reason = isSatisfied ? "Arrival date reached" : $"Arrival date is in the future ({tour.ArrivalDate:dd MMM yyyy})";
                        break;

                    case "FLIGHT_MANIFEST_VERIFIED":
                        isSatisfied = !string.IsNullOrEmpty(tour.ArrivalFlight);
                        reason = isSatisfied ? $"Arrival flight verified ({tour.ArrivalFlight})" : "Arrival flight number missing";
                        break;

                    case "RETURN_DATE_REACHED":
                        isSatisfied = DateTime.UtcNow >= tour.EndDate;
                        reason = isSatisfied ? "Return date reached (passengers departed)" : $"Departure date is in the future ({tour.EndDate:dd MMM yyyy})";
                        break;

                    case "REVENUE_EXPENSE_RECONCILED":
                        isSatisfied = tour.TourServices.Any();
                        reason = isSatisfied ? "Supplier costs & client sales reconciled" : "No services or invoice entries found";
                        break;

                    case "ACCOUNTING_CLOSED":
                        isSatisfied = tour.AccountingClosed;
                        reason = isSatisfied ? "Accounting audit closed" : "Accounting audit flag is unset (Accounting Open)";
                        break;

                    default:
                        isSatisfied = true;
                        reason = "Satisfied";
                        break;
                }

                if (!isSatisfied && chk.IsMandatory)
                {
                    canAdvance = false;
                    missingMandatoryCount++;
                }

                evaluationResults.Add(new
                {
                    chk.Id,
                    chk.TargetStatusId,
                    chk.CheckpointKey,
                    chk.Name,
                    chk.Description,
                    chk.IsMandatory,
                    chk.WarningThresholdDays,
                    IsSatisfied = isSatisfied,
                    Reason = reason
                });
            }

            return Ok(new
            {
                TourId = tour.Id,
                TourCode = tour.TourCode,
                CurrentStatusId = tour.TourStatusId,
                CurrentStatusName = tour.TourStatus?.Name ?? "N/A",
                TargetStatusId = targetStatus,
                CanAdvance = canAdvance,
                MissingMandatoryCount = missingMandatoryCount,
                Checkpoints = evaluationResults
            });
        }

        // POST: api/TourStatusCheckpoints/advance-status/5
        [HttpPost("advance-status/{tourId}")]
        public async Task<IActionResult> AutoAdvanceStatus(int tourId)
        {
            var tour = await _context.Tours
                .Include(t => t.TourStatus)
                .Include(t => t.TourServices!)
                    .ThenInclude(ts => ts.ServiceCategory)
                .FirstOrDefaultAsync(t => t.Id == tourId);

            if (tour == null) return NotFound("Tour not found");

            int nextStatusId = tour.TourStatusId + 1;
            if (nextStatusId > 5) return BadRequest("Tour is already at maximum completed status");

            // Evaluate checkpoints
            var evalResult = await EvaluateTourCheckpointsInternal(tour, nextStatusId);
            if (!evalResult.CanAdvance)
            {
                return BadRequest(new
                {
                    Message = $"Cannot advance to next status. {evalResult.MissingMandatoryCount} mandatory checkpoints failed.",
                    MissingCheckpoints = evalResult.Checkpoints.Where(c => !c.IsSatisfied && c.IsMandatory)
                });
            }

            tour.TourStatusId = nextStatusId;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Tour status successfully advanced to status #{nextStatusId}",
                NewStatusId = tour.TourStatusId,
                TourId = tour.Id
            });
        }

        // GET: api/TourStatusCheckpoints/warnings
        [HttpGet("warnings")]
        public async Task<IActionResult> GetSLAWarnings()
        {
            var now = DateTime.UtcNow;
            var activeTours = await _context.Tours
                .Include(t => t.TourStatus)
                .Include(t => t.TourServices!)
                    .ThenInclude(ts => ts.ServiceCategory)
                .Where(t => t.TourStatusId < 5)
                .ToListAsync();

            var warnings = new List<object>();

            foreach (var tour in activeTours)
            {
                var daysToArrival = (tour.ArrivalDate - now).TotalDays;
                var daysPostTour = (now - tour.EndDate).TotalDays;

                // 7 Days to Departure (Hotel / Transport)
                if (daysToArrival > 0 && daysToArrival <= 7)
                {
                    bool hasHotel = tour.TourServices.Any(s => s.HotelId != null || s.ServiceCategory?.Name == "Hotel");
                    if (!hasHotel)
                    {
                        AddWarning(warnings, tour, "WARNING_HOTEL_7D", "⚠️ 7 Days to Departure", $"Hotel reservation unconfirmed for tour {tour.TourCode} ({daysToArrival:F0}d to start)", "AMBER");
                    }

                    bool hasTransport = tour.TourServices.Any(s => s.DriverId != null || s.TransportCompanyId != null || s.ServiceCategory?.Name == "Transport");
                    if (!hasTransport)
                    {
                        AddWarning(warnings, tour, "WARNING_BUS_7D", "⚠️ 7 Days to Departure", $"Transport company unconfirmed for tour {tour.TourCode} ({daysToArrival:F0}d to start)", "AMBER");
                    }
                }

                // 3 Days to Departure (Guide)
                if (daysToArrival > 0 && daysToArrival <= 3)
                {
                    bool hasGuide = tour.TourServices.Any(s => s.GuideId != null || s.ServiceCategory?.Name == "Guide");
                    if (!hasGuide)
                    {
                        AddWarning(warnings, tour, "WARNING_GUIDE_3D", "⚠️ 3 Days to Departure", $"NO Tour Guide assigned for tour {tour.TourCode} starting in {daysToArrival:F0} days!", "ROSE");
                    }
                }

                // 24 Hours to Departure (Flight Manifest)
                if (daysToArrival > 0 && daysToArrival <= 1)
                {
                    if (string.IsNullOrEmpty(tour.ArrivalFlight))
                    {
                        AddWarning(warnings, tour, "CRITICAL_FLIGHT_24H", "🚨 24 Hours to Departure", $"Arrival flight number missing for tour {tour.TourCode}!", "ROSE");
                    }
                }

                // 7 Days Post-Tour (Accounting Closed)
                if (daysPostTour >= 7 && !tour.AccountingClosed)
                {
                    AddWarning(warnings, tour, "WARNING_ACCOUNTING_7D", "⚠️ Accounting Audit Overdue", $"Tour {tour.TourCode} returned {daysPostTour:F0} days ago but Accounting Closed flag is UNSET!", "AMBER");
                }
            }

            return Ok(warnings);
        }

        private void AddWarning(List<object> list, Tour tour, string code, string title, string message, string severity)
        {
            list.Add(new
            {
                TourId = tour.Id,
                TourCode = tour.TourCode,
                WarningCode = code,
                Title = title,
                Message = message,
                Severity = severity,
                ArrivalDate = tour.ArrivalDate
            });
        }

        private async Task<EvalResultInternal> EvaluateTourCheckpointsInternal(Tour tour, int targetStatusId)
        {
            var metadataCheckpoints = await _context.TourStatusCheckpoints
                .Where(c => c.TargetStatusId == targetStatusId)
                .ToListAsync();

            var list = new List<ChkResultInternal>();
            bool canAdvance = true;
            int missingCount = 0;

            foreach (var chk in metadataCheckpoints)
            {
                bool isSat = true;
                if (chk.CheckpointKey == "HOTEL_RESERVATIONS_CONFIRMED")
                    isSat = tour.TourServices.Any(s => s.HotelId != null || s.ServiceCategory?.Name == "Hotel");
                else if (chk.CheckpointKey == "GUIDE_ASSIGNED_CONFIRMED")
                    isSat = tour.TourServices.Any(s => s.GuideId != null || s.ServiceCategory?.Name == "Guide");
                else if (chk.CheckpointKey == "TRANSPORT_CONFIRMED")
                    isSat = tour.TourServices.Any(s => s.DriverId != null || s.TransportCompanyId != null || s.ServiceCategory?.Name == "Transport");
                else if (chk.CheckpointKey == "ARRIVAL_DATE_REACHED")
                    isSat = DateTime.UtcNow >= tour.ArrivalDate;
                else if (chk.CheckpointKey == "RETURN_DATE_REACHED")
                    isSat = DateTime.UtcNow >= tour.EndDate;
                else if (chk.CheckpointKey == "ACCOUNTING_CLOSED")
                    isSat = tour.AccountingClosed;

                if (!isSat && chk.IsMandatory)
                {
                    canAdvance = false;
                    missingCount++;
                }

                list.Add(new ChkResultInternal { CheckpointKey = chk.CheckpointKey, Name = chk.Name, IsSatisfied = isSat, IsMandatory = chk.IsMandatory });
            }

            return new EvalResultInternal { CanAdvance = canAdvance, MissingMandatoryCount = missingCount, Checkpoints = list };
        }
    }

    public class EvalResultInternal
    {
        public bool CanAdvance { get; set; }
        public int MissingMandatoryCount { get; set; }
        public List<ChkResultInternal> Checkpoints { get; set; } = new List<ChkResultInternal>();
    }

    public class ChkResultInternal
    {
        public string CheckpointKey { get; set; } = "";
        public string Name { get; set; } = "";
        public bool IsSatisfied { get; set; }
        public bool IsMandatory { get; set; }
    }
}
