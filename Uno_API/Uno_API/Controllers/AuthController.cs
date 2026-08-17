using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uno_API.Data;
using Uno_API.Models;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public AuthController(UnoDbContext context)
        {
            _context = context;
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Error = "Email and password are required."
                });
            }

            var cleanEmail = request.Email.Trim().ToLower();
            var cleanPass = request.Password.Trim();

            var users = await _context.Users.Where(u => u.IsActive).ToListAsync();
            var user = users.FirstOrDefault(u => 
                (u.Email.ToLower() == cleanEmail || u.Email.Split('@', System.StringSplitOptions.None)[0].ToLower() == cleanEmail) && 
                u.Password == cleanPass);

            if (user == null)
            {
                return Unauthorized(new LoginResponse
                {
                    Success = false,
                    Error = "Invalid username or password. Please check your credentials."
                });
            }

            return Ok(new LoginResponse
            {
                Success = true,
                User = new UserSessionDto
                {
                    Email = user.Email,
                    Name = user.Name,
                    Role = user.Role,
                    LoginTime = DateTime.UtcNow.ToString("o")
                }
            });
        }

        // GET: api/Auth/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.OrderBy(u => u.Id).ToListAsync();
        }

        // POST: api/Auth/users
        [HttpPost("users")]
        public async Task<ActionResult<User>> CreateUser([FromBody] User newUser)
        {
            if (string.IsNullOrWhiteSpace(newUser.Email) || string.IsNullOrWhiteSpace(newUser.Password))
            {
                return BadRequest(new { error = "Email and Password are required." });
            }

            var cleanEmail = newUser.Email.Trim().ToLower();
            var existing = await _context.Users.AnyAsync(u => u.Email.ToLower() == cleanEmail);
            if (existing)
            {
                return BadRequest(new { error = "A user account with this email address already exists." });
            }

            newUser.Email = cleanEmail;
            newUser.Name = string.IsNullOrWhiteSpace(newUser.Name) ? cleanEmail.Split('@')[0] : newUser.Name.Trim();
            newUser.Role = string.IsNullOrWhiteSpace(newUser.Role) ? "Manager" : newUser.Role.Trim();
            newUser.IsActive = true;
            newUser.CreatedAt = DateTime.UtcNow;

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = newUser.Id }, newUser);
        }

        // PUT: api/Auth/users/{id}
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.Id)
            {
                return BadRequest(new { error = "User ID mismatch." });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { error = "User account not found." });
            }

            var cleanEmail = updatedUser.Email.Trim().ToLower();
            var emailConflict = await _context.Users.AnyAsync(u => u.Email.ToLower() == cleanEmail && u.Id != id);
            if (emailConflict)
            {
                return BadRequest(new { error = "Another user account is already using this email address." });
            }

            user.Name = updatedUser.Name;
            user.Email = cleanEmail;
            if (!string.IsNullOrWhiteSpace(updatedUser.Password))
            {
                user.Password = updatedUser.Password;
            }
            user.Role = updatedUser.Role;
            user.IsActive = updatedUser.IsActive;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Auth/users/{id}
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { error = "User account not found." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
