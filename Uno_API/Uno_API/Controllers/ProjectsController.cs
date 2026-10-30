using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;
using Uno_API.Services;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly UnoDbContext _context;
        private readonly IStorageService _storageService;

        public ProjectsController(UnoDbContext context, IStorageService storageService)
        {
            _context = context;
            _storageService = storageService;
        }

        [HttpGet("debug-env")]
        public ActionResult GetDebugEnv([FromServices] IWebHostEnvironment env)
        {
            return Ok(new {
                ContentRoot = env.ContentRootPath,
                WebRoot = env.WebRootPath,
                WebRootExists = System.IO.Directory.Exists(env.WebRootPath ?? ""),
                WebRootFiles = System.IO.Directory.Exists(env.WebRootPath ?? "") ? System.IO.Directory.GetFiles(env.WebRootPath) : new string[0],
                WebRootDirectories = System.IO.Directory.Exists(env.WebRootPath ?? "") ? System.IO.Directory.GetDirectories(env.WebRootPath) : new string[0],
                CurrentDirectory = System.IO.Directory.GetCurrentDirectory(),
                BaseDirectory = AppContext.BaseDirectory
            });
        }

        [HttpGet("storage-audit")]
        public ActionResult AuditLocalStorage([FromServices] IWebHostEnvironment env)
        {
            if (!string.Equals(Request.Headers["X-User-Role"].FirstOrDefault(), "Administrator", StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(403, new { error = "Only Administrators can audit server storage." });
            }
            var root = Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "Storage");
            if (!Directory.Exists(root)) return Ok(new { exists = false, root });
            var projects = Directory.GetDirectories(root).Select(p => new {
                projectName = Path.GetFileName(p),
                tours = Directory.GetDirectories(p).Select(t => Path.GetFileName(t)).ToList()
            }).ToList();
            return Ok(new { exists = true, root, projects });
        }

        [HttpPost("storage-resync-all")]
        public async Task<ActionResult> ResyncAllLocalStorage()
        {
            var tours = await _context.Tours.Include(t => t.Project).ToListAsync();
            int ensured = 0;
            foreach (var t in tours)
            {
                var pCode = t.Project?.ProjectCode ?? $"Project_{t.ProjectId}";
                var tCode = t.TourCode ?? $"Tour_{t.Id}";
                _storageService.EnsureTourFolders(pCode, tCode);
                ensured++;
            }
            return Ok(new { ensuredTours = ensured });
        }

        [HttpPost("storage-cleanup")]
        public async Task<ActionResult> CleanupLocalStorage([FromServices] IWebHostEnvironment env)
        {
            var root = Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "Storage");
            if (!Directory.Exists(root)) return Ok(new { message = "Storage root does not exist." });

            var validProjects = await _context.Projects.Select(p => p.ProjectCode.Trim().ToLower()).ToListAsync();
            var validTours = await _context.Tours.Select(t => t.TourCode.Trim().ToLower()).ToListAsync();

            var deletedDirs = new List<string>();
            foreach (var projDir in Directory.GetDirectories(root))
            {
                var pName = Path.GetFileName(projDir);
                var normP = pName.Replace("-", " ").Trim().ToLower();
                var normPStrict = pName.Trim().ToLower();
                if (!validProjects.Contains(normP) && !validProjects.Contains(normPStrict))
                {
                    Directory.Delete(projDir, true);
                    deletedDirs.Add($"Project: {pName}");
                    continue;
                }
                foreach (var tourDir in Directory.GetDirectories(projDir))
                {
                    var tName = Path.GetFileName(tourDir);
                    var normT = tName.Replace("-", " ").Trim().ToLower();
                    var normTStrict = tName.Trim().ToLower();
                    if (!validTours.Contains(normT) && !validTours.Contains(normTStrict))
                    {
                        Directory.Delete(tourDir, true);
                        deletedDirs.Add($"Tour: {pName}/{tName}");
                    }
                }
            }
            return Ok(new { deletedCount = deletedDirs.Count, deletedDirs });
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            if (string.Equals(Request.Headers["X-User-Role"].FirstOrDefault(), "Guide", StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(403, new { error = "Guides are not authorized to view the projects directory." });
            }
            try
            {
                var projects = await _context.Projects
                    .Include(p => p.Client)
                    .Include(p => p.Tours)
                    .Include(p => p.ProjectStatus)
                    .Select(p => new
                    {
                        p.Id,
                        p.ProjectCode,
                        p.ClientId,
                        ClientName = p.Client != null ? p.Client.Name : "",
                        p.ProjectStatusId,
                        p.StartDate,
                        p.EndDate,
                        p.Description,
                        p.ApproxBudget,
                        ProjectStatus = p.ProjectStatus != null ? p.ProjectStatus.Name : "",
                        StatusColor = p.ProjectStatus != null ? p.ProjectStatus.Name : "",
                        ToursCount = p.Tours.Count()
                    }).ToListAsync();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    error = ex.Message, 
                    innerError = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace 
                });
            }
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            if (string.Equals(Request.Headers["X-User-Role"].FirstOrDefault(), "Guide", StringComparison.OrdinalIgnoreCase))
            {
                int? guideId = null;
                if (int.TryParse(Request.Headers["X-User-Guide-Id"].FirstOrDefault(), out var parsedGId)) guideId = parsedGId;
                else
                {
                    var userEmail = Request.Headers["X-User-Email"].FirstOrDefault()?.Trim().ToLower();
                    if (!string.IsNullOrEmpty(userEmail))
                    {
                        var dbUser = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email.ToLower() == userEmail || u.Email.Split('@')[0].ToLower() == userEmail);
                        if (dbUser != null) guideId = dbUser.GuideId;
                    }
                }

                bool hasAssignedTour = guideId.HasValue && await _context.Tours.AnyAsync(t => t.ProjectId == id && t.TourServices.Any(ts => ts.GuideId == guideId.Value));
                if (!hasAssignedTour)
                {
                    return StatusCode(403, new { error = "Guides are only permitted to view projects containing their assigned tours." });
                }
            }
            var project = await _context.Projects
                .Include(p => p.Client)
                .Include(p => p.ProjectStatus)
                .Include(p => p.Tours!)
                    .ThenInclude(t => t.TourStatus)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            return project;
        }

        // POST: api/Projects
        [HttpPost]
        public async Task<ActionResult<Project>> PostProject(Project project)
        {
            if (string.Equals(Request.Headers["X-User-Role"].FirstOrDefault(), "Guide", StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(403, new { error = "Guides are not permitted to modify projects." });
            }
            // Ensure client exists
            if (!await _context.Clients.AnyAsync(c => c.Id == project.ClientId))
            {
                var client = await _context.Clients.FirstOrDefaultAsync();
                if (client == null)
                {
                    client = new Client { Name = "Default Client", Location = "Global" };
                    _context.Clients.Add(client);
                    await _context.SaveChangesAsync();
                }
                project.ClientId = client.Id;
            }

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Ensure project storage folder is created automatically on local server and Google Drive
            if (!string.IsNullOrWhiteSpace(project.ProjectCode) && _storageService != null)
            {
                await _storageService.EnsureProjectFolderAsync(project.ProjectCode);
            }

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/Projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(int id, Project project)
        {
            if (string.Equals(Request.Headers["X-User-Role"].FirstOrDefault(), "Guide", StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(403, new { error = "Guides are not permitted to modify projects." });
            }
            if (id != project.Id)
            {
                return BadRequest();
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                if (!string.IsNullOrWhiteSpace(project.ProjectCode) && _storageService != null)
                {
                    await _storageService.EnsureProjectFolderAsync(project.ProjectCode);
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            if (string.Equals(Request.Headers["X-User-Role"].FirstOrDefault(), "Guide", StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(403, new { error = "Guides are not permitted to delete projects." });
            }
            var userRole = Request.Headers["X-User-Role"].FirstOrDefault() ?? "";
            if (!string.IsNullOrEmpty(userRole) && !string.Equals(userRole, "Administrator", StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { error = "Only Administrators are authorized to delete projects." });
            }

            var project = await _context.Projects
                .Include(p => p.Tours)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            if (project.Tours != null && project.Tours.Any())
            {
                var tourIds = project.Tours.Select(t => t.Id).ToList();

                var services = await _context.TourServices.Where(s => tourIds.Contains(s.TourId)).ToListAsync();
                if (services.Any()) _context.TourServices.RemoveRange(services);

                var bookings = await _context.Bookings.Where(b => tourIds.Contains(b.TourId)).ToListAsync();
                if (bookings.Any()) _context.Bookings.RemoveRange(bookings);

                var passengers = await _context.Passengers.Where(p => tourIds.Contains(p.TourId)).ToListAsync();
                if (passengers.Any()) _context.Passengers.RemoveRange(passengers);

                var invoices = await _context.Invoices.Where(i => tourIds.Contains(i.TourId)).ToListAsync();
                if (invoices.Any()) _context.Invoices.RemoveRange(invoices);

                var attachments = await _context.TourAttachments.Where(a => tourIds.Contains(a.TourId)).ToListAsync();
                if (attachments.Any()) _context.TourAttachments.RemoveRange(attachments);

                _context.Tours.RemoveRange(project.Tours);
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }
}
