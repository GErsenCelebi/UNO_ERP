using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.DTOs;
using System.Linq;

namespace Uno_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TourCalendarController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public TourCalendarController(UnoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourCalendarEventDTO>>> GetCalendarEvents([FromQuery] TourCalendarFilterRequest filter)
        {
            var query = _context.Tours
                .Include(t => t.TourStatus)
                .Include(t => t.TourServices)
                    .ThenInclude(ts => ts.ServiceCategory)
                .Include(t => t.Bookings)
                .AsNoTracking()
                .AsQueryable();

            // 1. Apply Base Filters
            if (filter.StartDate.HasValue)
            {
                query = query.Where(t => t.EndDate >= filter.StartDate.Value);
            }
            if (filter.EndDate.HasValue)
            {
                query = query.Where(t => t.ArrivalDate <= filter.EndDate.Value);
            }
            if (filter.TourStatusIds != null && filter.TourStatusIds.Length > 0)
            {
                query = query.Where(t => filter.TourStatusIds.Contains(t.TourStatusId));
            }
            if (filter.ProjectIds != null && filter.ProjectIds.Length > 0)
            {
                query = query.Where(t => filter.ProjectIds.Contains(t.ProjectId));
            }
            if (!string.IsNullOrWhiteSpace(filter.SearchQuery))
            {
                var lowerSearch = filter.SearchQuery.ToLower();
                query = query.Where(t => 
                    (t.TourCode != null && t.TourCode.ToLower().Contains(lowerSearch)) ||
                    (t.Destination != null && t.Destination.ToLower().Contains(lowerSearch))
                );
            }

            // 2. Apply RBAC (Role-Based Access Control)
            // Managers see all; Guides see only tours they are assigned to
            if (!string.IsNullOrEmpty(filter.Role) && filter.Role.Equals("Guide", StringComparison.OrdinalIgnoreCase))
            {
                if (filter.CurrentUserId.HasValue)
                {
                    query = query.Where(t => t.TourServices.Any(ts => ts.GuideId == filter.CurrentUserId.Value));
                }
                else
                {
                    // If Role is Guide but no User ID provided, return empty or unauthorized. We'll return empty.
                    return Ok(new List<TourCalendarEventDTO>());
                }
            }

            if (filter.GuideIds != null && filter.GuideIds.Length > 0)
            {
                query = query.Where(t => t.TourServices.Any(ts => ts.GuideId.HasValue && filter.GuideIds.Contains(ts.GuideId.Value)));
            }

            var tours = await query.ToListAsync();

            // Need guide names to map. Let's fetch all relevant guides from DB.
            var allGuideIds = tours.SelectMany(t => t.TourServices)
                .Where(ts => ts.GuideId.HasValue)
                .Select(ts => ts.GuideId!.Value)
                .Distinct()
                .ToList();

            var guidesDictionary = await _context.Guides
                .Where(g => allGuideIds.Contains(g.Id))
                .ToDictionaryAsync(g => g.Id, g => g.Name);

            var result = new List<TourCalendarEventDTO>();

            // 4. Map and Detect Conflicts
            foreach (var tour in tours)
            {
                var assignedGuideIds = tour.TourServices
                    .Where(ts => ts.GuideId.HasValue)
                    .Select(ts => ts.GuideId!.Value)
                    .Distinct()
                    .ToList();

                var assignedGuideNames = assignedGuideIds
                    .Where(id => guidesDictionary.ContainsKey(id))
                    .Select(id => guidesDictionary[id])
                    .ToList();

                var guideAssignments = tour.TourServices
                    .Where(ts => ts.GuideId.HasValue && guidesDictionary.ContainsKey(ts.GuideId.Value))
                    .Select(ts => new GuideAssignmentDTO
                    {
                        GuideId = ts.GuideId!.Value,
                        GuideName = guidesDictionary[ts.GuideId.Value],
                        StartDate = ts.ServiceDate,
                        EndDate = ts.ServiceEndDate
                    })
                    .ToList();

                // Conflict detection (overlapping dates for the same Guide: (TourA.ArrivalDate <= TourB.EndDate) AND (TourA.EndDate >= TourB.ArrivalDate))
                bool hasGuideConflict = false;
                
                foreach(var guideId in assignedGuideIds)
                {
                    // Check if this guide is assigned to any other tour that overlaps with this one
                    var hasOverlap = tours.Any(otherTour => 
                        otherTour.Id != tour.Id && 
                        otherTour.TourServices.Any(ts => 
                            ts.GuideId == guideId && 
                            // Check overlap of the guide's assigned service dates (or fallback to tour dates if null)
                            (ts.ServiceDate ?? otherTour.ArrivalDate) <= (tour.EndDate) && 
                            (ts.ServiceEndDate ?? ts.ServiceDate ?? otherTour.EndDate) >= (tour.ArrivalDate)
                        )
                    );

                    if (hasOverlap)
                    {
                        hasGuideConflict = true;
                        break;
                    }
                }

                result.Add(new TourCalendarEventDTO
                {
                    TourId = tour.Id,
                    ProjectId = tour.ProjectId,
                    TourCode = tour.TourCode ?? string.Empty,
                    Destination = tour.Destination ?? string.Empty,
                    ArrivalDate = tour.ArrivalDate,
                    EndDate = tour.EndDate,
                    Pax = tour.Pax,
                    StatusName = tour.TourStatus?.Name ?? "Unknown",
                    AssignedGuideIds = assignedGuideIds,
                    AssignedGuideNames = assignedGuideNames,
                    GuideAssignments = guideAssignments,
                    HasGuideConflict = hasGuideConflict
                });
            }

            return Ok(result);
        }
    }
}
