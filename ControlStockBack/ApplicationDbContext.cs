using Microsoft.EntityFrameworkCore;
using ControlStockBack.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Client> Clients { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de la tabla Cliente
        modelBuilder.Entity<Client>()
            .ToTable("Client");

        modelBuilder.Entity<Client>()
            .HasMany(c => c.Orders)
            .WithOne(o => o.Client)
            .HasForeignKey(o => o.ClientId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configuración de la tabla Producto
        modelBuilder.Entity<Product>()
            .ToTable("Product");

        modelBuilder.Entity<Product>()
            .Property(pr => pr.Price)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Product>()
            .Property(pr => pr.Code)
            .IsRequired()
            .HasMaxLength(20);

        // Configuración de la tabla Pedido
        modelBuilder.Entity<Order>()
            .ToTable("Order");

        modelBuilder.Entity<Order>()
            .Property(o => o.Total)
            .HasColumnType("decimal(18,2)");
    }
}
