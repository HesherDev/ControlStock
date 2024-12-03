using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ControlStockBack.Models
{
    public class Client
    {
        [Key]
        public int ClientId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; }

        [MaxLength(15)]
        public string Phone { get; set; }

        [MaxLength(200)]
        public string Address { get; set; }

        // Relación con pedidos
        public ICollection<Order>? Orders { get; set; } 
    }
}
