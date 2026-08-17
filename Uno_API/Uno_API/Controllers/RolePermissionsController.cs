using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolePermissionsController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public RolePermissionsController(UnoDbContext context)
        {
            _context = context;
        }

        // GET: api/RolePermissions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolePermission>>> GetPermissions()
        {
            return await _context.RolePermissions.OrderBy(r => r.RoleName).ThenBy(r => r.Id).ToListAsync();
        }

        // GET: api/RolePermissions/role/{roleName}
        [HttpGet("role/{roleName}")]
        public async Task<ActionResult<IEnumerable<RolePermission>>> GetPermissionsByRole(string roleName)
        {
            return await _context.RolePermissions
                .Where(r => r.RoleName.ToLower() == roleName.ToLower())
                .ToListAsync();
        }

        // POST: api/RolePermissions/bulk-update
        [HttpPost("bulk-update")]
        public async Task<IActionResult> BulkUpdatePermissions([FromBody] List<RolePermission> permissions)
        {
            if (permissions == null || permissions.Count == 0)
            {
                return BadRequest(new { error = "No permissions provided for update." });
            }

            foreach (var perm in permissions)
            {
                var existing = await _context.RolePermissions.FirstOrDefaultAsync(r => 
                    r.RoleName.ToLower() == perm.RoleName.ToLower() && 
                    r.ScreenKey.ToLower() == perm.ScreenKey.ToLower());

                if (existing != null)
                {
                    existing.CanView = perm.CanView;
                    existing.CanEntry = perm.CanEntry;
                    existing.CanUpdate = perm.CanUpdate;
                    existing.CanDelete = perm.CanDelete;
                }
                else
                {
                    _context.RolePermissions.Add(new RolePermission
                    {
                        RoleName = perm.RoleName,
                        ScreenKey = perm.ScreenKey,
                        CanView = perm.CanView,
                        CanEntry = perm.CanEntry,
                        CanUpdate = perm.CanUpdate,
                        CanDelete = perm.CanDelete
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, count = permissions.Count });
        }

        // DELETE: api/RolePermissions/role/{roleName}
        [HttpDelete("role/{roleName}")]
        public async Task<IActionResult> DeleteRolePermissions(string roleName)
        {
            var items = await _context.RolePermissions
                .Where(r => r.RoleName.ToLower() == roleName.ToLower())
                .ToListAsync();

            if (items.Count > 0)
            {
                _context.RolePermissions.RemoveRange(items);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }
    }
}
