using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControlStockBack.Models;
using ControlStockBack.Data;

namespace ControlStockBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return Ok(await _context.Orders.Include(o => o.Client).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders.Include(o => o.Client)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
                return NotFound(new { mensaje = "Pedido no encontrado." });

            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (order.OrderId != 0)
            {
                return BadRequest(new { mensaje = "El ID del pedido no debe enviarse al crear un nuevo pedido." });
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, Order order)
        {
            if (id != order.OrderId)
                return BadRequest(new { mensaje = "El ID proporcionado no coincide con el pedido." });

            var existingOrder = await _context.Orders.FindAsync(id);
            if (existingOrder == null)
                return NotFound(new { mensaje = "Pedido no encontrado." });

            try
            {
                _context.Entry(existingOrder).CurrentValues.SetValues(order);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return StatusCode(500, "Ocurrió un error al actualizar el pedido.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound(new { mensaje = "Pedido no encontrado." });

            try
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return StatusCode(500, "Ocurrió un error al eliminar el pedido.");
            }
        }
    }
}
