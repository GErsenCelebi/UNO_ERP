using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public ProjectsController(UnoDbContext context)
        {
            _context = context;
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

        // GET: api/Projects
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
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

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/Projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(int id, Project project)
        {
            if (id != project.Id)
            {
                return BadRequest();
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
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
