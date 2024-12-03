using System;
using System.ComponentModel.DataAnnotations;

namespace ControlStockBack.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        [Required]
        public int ClientId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; } = DateTime.Now;

        [Required]
        public decimal Total { get; set; }

        // Relación con Cliente
        public Client? Client { get; set; }
    }
}
