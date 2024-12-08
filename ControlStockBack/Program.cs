using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configurar la cadena de conexi�n
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("La cadena de conexi�n 'DefaultConnection' no est� configurada en appsettings.json.");

// Configurar DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configurar controladores y serializaci�n JSON
builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Evitar referencias c�clicas en entidades relacionadas
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;

    // Configuraci�n de la nomenclatura de propiedades
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
              .AllowAnyMethod()                    // Permitir cualquier m�todo HTTP (GET, POST, PUT, DELETE, etc.)
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
app.UseHttpsRedirection(); // Redirigir autom�ticamente a HTTPS
app.UseCors("AllowOrigin"); // Configurar CORS antes de los controladores
app.UseAuthorization();    // Configurar autorizaci�n

// Mapear controladores
app.MapControllers();

// Iniciar la aplicaci�n
app.Run();
