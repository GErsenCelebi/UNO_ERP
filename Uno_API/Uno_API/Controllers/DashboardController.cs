using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using System.Linq;

namespace Uno_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public DashboardController(UnoDbContext context)
        {
            _context = context;
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics([FromQuery] string? projectIds = null, [FromQuery] string? projectStatusIds = null)
        {
            var parsedProjectIds = string.IsNullOrEmpty(projectIds) ? new List<int>() : projectIds.Split(',').Select(int.Parse).ToList();
            var parsedStatusIds = string.IsNullOrEmpty(projectStatusIds) ? new List<int>() : projectStatusIds.Split(',').Select(int.Parse).ToList();

            // Base Project Query
            var projectsQuery = _context.Projects
                .Include(p => p.Tours)
                .ThenInclude(t => t.TourServices)
                .ThenInclude(ts => ts.ServiceCategory)
                .AsNoTracking()
                .AsQueryable();

            if (parsedProjectIds.Any())
            {
                projectsQuery = projectsQuery.Where(p => parsedProjectIds.Contains(p.Id));
            }

            if (parsedStatusIds.Any())
            {
                projectsQuery = projectsQuery.Where(p => parsedStatusIds.Contains(p.ProjectStatusId));
            }

            var projects = await projectsQuery.ToListAsync();
            var allTours = projects.SelectMany(p => p.Tours).ToList();

            // KPI 1: Tour Actuals
            int preConfirmedTours = allTours.Count(t => t.TourStatusId == 1 || t.TourStatusId == 2 || t.TourStatusId == 6); // Draft, Proposal, Cancelled
            int activeDoneTours = allTours.Count(t => t.TourStatusId == 3 || t.TourStatusId == 4 || t.TourStatusId == 5); // Confirmed, In Progress, Completed

            // KPI 2: Project Actuals
            int activeCompletedProjects = projects.Count(p => p.ProjectStatusId == 3 || p.ProjectStatusId == 5); // Active, Completed
            int restProjects = projects.Count(p => p.ProjectStatusId != 3 && p.ProjectStatusId != 5);

            // KPI 3: Project Volume Actualization
            decimal totalApproxBudget = projects.Sum(p => p.ApproxBudget);
            
            var validToursForVolume = allTours.Where(t => t.TourStatusId == 3 || t.TourStatusId == 4 || t.TourStatusId == 5).ToList();
            decimal totalRevenue = validToursForVolume.Sum(t => t.TourServices.Where(ts => ts.IsRevenue ?? ts.ServiceCategory?.Type == "Revenue").Sum(ts => ts.TotalAmount));
            decimal totalExpense = validToursForVolume.Sum(t => t.TourServices.Where(ts => !(ts.IsRevenue ?? ts.ServiceCategory?.Type == "Revenue")).Sum(ts => ts.TotalAmount));

            // KPI 4: Tour Breakdown (Revenue/Expense by Status)
            var tourBreakdowns = allTours.GroupBy(t => t.TourStatusId)
                .Select(g => new
                {
                    StatusId = g.Key,
                    Count = g.Count(),
                    Revenue = g.Sum(t => t.TourServices.Where(ts => ts.IsRevenue ?? ts.ServiceCategory?.Type == "Revenue").Sum(ts => ts.TotalAmount)),
                    Expense = g.Sum(t => t.TourServices.Where(ts => !(ts.IsRevenue ?? ts.ServiceCategory?.Type == "Revenue")).Sum(ts => ts.TotalAmount))
                }).ToList();

            // Gantt Projects
            var ganttProjects = projects.Select(p => new
            {
                Id = p.Id,
                ProjectCode = p.ProjectCode,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                ApproxBudget = p.ApproxBudget,
                StatusId = p.ProjectStatusId
            }).ToList();

            return Ok(new
            {
                TourActuals = new { PreConfirmed = preConfirmedTours, ActiveDone = activeDoneTours },
                ProjectActuals = new { ActiveCompleted = activeCompletedProjects, Rest = restProjects },
                ProjectVolume = new { EstimatedBudget = totalApproxBudget, Revenue = totalRevenue, Expense = totalExpense },
                TourBreakdowns = tourBreakdowns,
                GanttProjects = ganttProjects
            });
        }
    }
}
