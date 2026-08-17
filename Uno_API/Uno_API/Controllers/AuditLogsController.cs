using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogsController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public AuditLogsController(UnoDbContext context)
        {
            _context = context;
        }

        // GET: api/AuditLogs?entityName=Hotel&entityId=5
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLog>>> GetAuditLogs(
            [FromQuery] string? entityName,
            [FromQuery] string? entityId,
            [FromQuery] string? userEmail,
            [FromQuery] string? action,
            [FromQuery] int limit = 100)
        {
            var query = _context.AuditLogs.AsQueryable();

            if (!string.IsNullOrWhiteSpace(entityName))
            {
                query = query.Where(a => a.EntityName.ToLower() == entityName.Trim().ToLower());
            }

            if (!string.IsNullOrWhiteSpace(entityId))
            {
                query = query.Where(a => a.EntityId.ToLower() == entityId.Trim().ToLower());
            }

            if (!string.IsNullOrWhiteSpace(userEmail))
            {
                query = query.Where(a => a.UserEmail.ToLower() == userEmail.Trim().ToLower());
            }

            if (!string.IsNullOrWhiteSpace(action))
            {
                query = query.Where(a => a.Action.ToLower() == action.Trim().ToLower());
            }

            var logs = await query
                .OrderByDescending(a => a.Timestamp)
                .Take(limit)
                .ToListAsync();

            return Ok(logs);
        }

        // POST: api/AuditLogs (Manual audit log creation from frontend operations)
        [HttpPost]
        public async Task<ActionResult<AuditLog>> CreateAuditLog([FromBody] AuditLog log)
        {
            if (log.Timestamp == default)
            {
                log.Timestamp = DateTime.UtcNow;
            }

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAuditLogs), new { id = log.Id }, log);
        }
    }
}
