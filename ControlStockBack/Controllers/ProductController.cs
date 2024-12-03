using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControlStockBack.Models;
using ControlStockBack.Data;

namespace ControlStockBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return Ok(await _context.Products.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound(new { message = "Producto no encontrado." });

            return Ok(product);
        }

        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetProductByCode(string code)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Code == code);
            if (product == null)
            {
                return NotFound(new { message = $"No se encontró un producto con el código '{code}'." });
            }

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (product.ProductId != 0)
            {
                return BadRequest(new { message = "El ProductId no debe ser enviado al crear un producto." });
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.ProductId)
                return BadRequest(new { message = "El ID proporcionado no coincide con el producto." });

            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
                return NotFound(new { message = "Producto no encontrado." });

            try
            {
                _context.Entry(existingProduct).CurrentValues.SetValues(product);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return StatusCode(500, "Hubo un error al actualizar el producto.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = "Producto no encontrado." });

            try
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return StatusCode(500, "Error al eliminar el producto.");
            }
        }
    }
}
