using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControlStockBack.Models;

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

        // GET: api/Order
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var orders = await _context.Orders.Include(o => o.Client).ToListAsync();
            return Ok(orders);
        }

        // GET: api/Order/resume
        [HttpGet("resume")]
        public async Task<ActionResult<IEnumerable<object>>> GetOrderSummary()
        {
            var orders = await _context.Orders
                .Include(o => o.Client)
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    o.Total,
                    ClientName = o.Client != null ? o.Client.Name : "Unknown"
                })
                .ToListAsync();

            return Ok(orders);
        }

        // POST: api/Order
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var client = await _context.Clients.FindAsync(order.ClientId);
            if (client == null)
                return NotFound(new { mensaje = "Cliente no encontrado." });

            order.Client = client;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrders), new { id = order.OrderId }, order);
        }

        // PUT: api/Order/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (id != order.OrderId)
                return BadRequest(new { mensaje = "El ID proporcionado no coincide con el pedido." });

            var existingOrder = await _context.Orders.Include(o => o.Client).FirstOrDefaultAsync(o => o.OrderId == id);
            if (existingOrder == null)
                return NotFound(new { mensaje = "Pedido no encontrado." });

            var client = await _context.Clients.FindAsync(order.ClientId);
            if (client == null)
                return NotFound(new { mensaje = "Cliente no encontrado." });

            existingOrder.OrderDate = order.OrderDate;
            existingOrder.Total = order.Total;
            existingOrder.Client = client;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Order/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.Include(o => o.Client).FirstOrDefaultAsync(o => o.OrderId == id);
            if (order == null)
                return NotFound(new { mensaje = "Pedido no encontrado." });

            try
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Pedido eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al eliminar el pedido.", detalles = ex.Message });
            }
        }
    }
}
