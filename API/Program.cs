using Application;
using Domain.Entities;
using Infrastructure;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProCode API", Version = "v1" });
});
builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration);

builder.Services.AddAuthorization();
builder.Services
    .AddIdentityApiEndpoints<User>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapIdentityApi<User>();
app.MapControllers();

app.Run();