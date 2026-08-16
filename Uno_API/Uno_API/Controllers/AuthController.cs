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
            return await _context.Users.ToListAsync();
        }
    }
}
