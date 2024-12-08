using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configurar la cadena de conexión
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("La cadena de conexión 'DefaultConnection' no está configurada en appsettings.json.");

// Configurar DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configurar controladores y serialización JSON
builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Evitar referencias cíclicas en entidades relacionadas
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;

    // Configuración de la nomenclatura de propiedades
    options.JsonSerializerOptions.PropertyNamingPolicy = null; // Mantener nombres originales de las propiedades
});

// Configurar Swagger (solo para entornos de desarrollo)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", policy =>
        policy.WithOrigins("http://localhost:4200") // Origen permitido (tu frontend)
              .AllowAnyMethod()                    // Permitir cualquier método HTTP (GET, POST, PUT, DELETE, etc.)
              .AllowAnyHeader()                    // Permitir cualquier encabezado
              .SetPreflightMaxAge(TimeSpan.FromMinutes(10))); // Mejorar el rendimiento con cacheo de preflight
});

var app = builder.Build();

// Configurar middleware para entornos de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configurar middleware de seguridad
app.UseHttpsRedirection(); // Redirigir automáticamente a HTTPS
app.UseCors("AllowOrigin"); // Configurar CORS antes de los controladores
app.UseAuthorization();    // Configurar autorización

// Mapear controladores
app.MapControllers();

// Iniciar la aplicación
app.Run();
