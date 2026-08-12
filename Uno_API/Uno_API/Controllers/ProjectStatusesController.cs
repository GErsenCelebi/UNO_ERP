using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectStatusesController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public ProjectStatusesController(UnoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectStatus>>> GetProjectStatuses()
        {
            return await _context.ProjectStatuses.OrderBy(s => s.OrderIndex).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectStatus>> GetProjectStatus(int id)
        {
            var status = await _context.ProjectStatuses.FindAsync(id);
            if (status == null) return NotFound();
            return status;
        }

        [HttpPost]
        public async Task<ActionResult<ProjectStatus>> PostProjectStatus(ProjectStatus status)
        {
            _context.ProjectStatuses.Add(status);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProjectStatus), new { id = status.Id }, status);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProjectStatus(int id, ProjectStatus status)
        {
            if (id != status.Id) return BadRequest();
            _context.Entry(status).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectStatusExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectStatus(int id)
        {
            var status = await _context.ProjectStatuses.FindAsync(id);
            if (status == null) return NotFound();
            _context.ProjectStatuses.Remove(status);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ProjectStatusExists(int id)
        {
            return _context.ProjectStatuses.Any(e => e.Id == id);
        }
    }
}
