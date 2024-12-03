using System.ComponentModel.DataAnnotations;

namespace ControlStockBack.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [MaxLength(100, ErrorMessage = "El nombre no puede tener más de 100 caracteres.")]
        public string Name { get; set; }

        [MaxLength(500, ErrorMessage = "La descripción no puede tener más de 500 caracteres.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "El precio es obligatorio.")]
        [Range(0, double.MaxValue, ErrorMessage = "El precio debe ser un número positivo.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "La cantidad es obligatoria.")]
        [Range(0, int.MaxValue, ErrorMessage = "La cantidad debe ser un número positivo.")]
        public int Quantity { get; set; }

        [MaxLength(50, ErrorMessage = "La categoría no puede tener más de 50 caracteres.")]
        public string? Category { get; set; }

        [Required(ErrorMessage = "El código es obligatorio.")]
        [MaxLength(20, ErrorMessage = "El código no puede tener más de 20 caracteres.")]
        public string Code { get; set; }

        [Required(ErrorMessage = "El ID de usuario es obligatorio.")]
        public int UserId { get; set; } // Asumimos que UserId es un entero
    }
}
