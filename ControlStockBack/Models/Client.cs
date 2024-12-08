using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ControlStockBack.Models
{
    public class Client
    {
        public int ClientId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        // Si necesitas inicializar colecciones, hazlo en el constructor o con una inicialización predeterminada:
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
