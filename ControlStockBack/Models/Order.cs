using System;
using System.ComponentModel.DataAnnotations;

namespace ControlStockBack.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public int ClientId { get; set; }
        public Client Client { get; set; } = new Client();  // Inicializa como nuevo objeto si no es null.
        public DateTime OrderDate { get; set; }
        public decimal Total { get; set; }
    }

}