using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControlStockBack.Models;
using ControlStockBack.Data;

namespace ControlStockBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            return Ok(await _context.Clients.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);

            if (client == null)
                return NotFound(new { mensaje = "Cliente no encontrado." });

            return Ok(client);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClient([FromBody] Client client)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (client.ClientId != 0)
            {
                return BadRequest(new { mensaje = "El ID del cliente no debe enviarse al crear un nuevo cliente." });
            }

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClient), new { id = client.ClientId }, client);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(int id, Client client)
        {
            if (id != client.ClientId)
                return BadRequest(new { mensaje = "El ID proporcionado no coincide con el cliente." });

            var existingClient = await _context.Clients.FindAsync(id);
            if (existingClient == null)
                return NotFound(new { mensaje = "Cliente no encontrado." });

            try
            {
                _context.Entry(existingClient).CurrentValues.SetValues(client);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return StatusCode(500, "Ocurrió un error al actualizar el cliente.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
                return NotFound(new { mensaje = "Cliente no encontrado." });

            try
            {
                _context.Clients.Remove(client);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return StatusCode(500, "Ocurrió un error al eliminar el cliente.");
            }
        }
    }
}
