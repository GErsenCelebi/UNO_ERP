using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Uno_API.Models;
using Uno_API.Data;

namespace Uno_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransportCompaniesController : ControllerBase
    {
        private readonly UnoDbContext _context;

        public TransportCompaniesController(UnoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransportCompany>>> GetTransportCompanies()
        {
            return await _context.TransportCompanies.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransportCompany>> GetTransportCompany(int id)
        {
            var company = await _context.TransportCompanies.FindAsync(id);
            if (company == null) return NotFound();
            return company;
        }

        [HttpPost]
        public async Task<ActionResult<TransportCompany>> PostTransportCompany(TransportCompany company)
        {
            _context.TransportCompanies.Add(company);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTransportCompany), new { id = company.Id }, company);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransportCompany(int id, TransportCompany company)
        {
            if (id != company.Id) return BadRequest();
            _context.Entry(company).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransportCompanyExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransportCompany(int id)
        {
            var company = await _context.TransportCompanies.FindAsync(id);
            if (company == null) return NotFound();
            _context.TransportCompanies.Remove(company);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TransportCompanyExists(int id)
        {
            return _context.TransportCompanies.Any(e => e.Id == id);
        }
    }
}
