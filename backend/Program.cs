using System.Text;
using backend.data;
using backend.interfaces;
using backend.repositories;
using backend.services;
using backend.services.impl;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Remove manual Kestrel configuration - let Docker handle it via ASPNETCORE_URLS

// CORS for React
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactAppPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:5173",
                // "http://mangaserver.ddnsfree.com:3000"
                "https://mangaserver.ddnsfree.com"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.Configure<FormOptions>(o => {
    o.MultipartBodyLengthLimit = 50_000_000; // 50 MB
});


// controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// dependency Injection registrations
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<IDefaultCardService, DefaultCardService>();
builder.Services.AddScoped<IDefaultCardRepository, DefaultCardRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICustomCardService, CustomCardService>();
builder.Services.AddScoped<ICustomCardRepository, CustomCardRepository>();
builder.Services.AddScoped<ICardService, CardService>();

builder.Services.AddHttpClient();

// configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("Secret");
var audience = jwtSettings.GetValue<string>("Audience");

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"]!))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// seed sample data into MongoDB
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
    await context.InsertSampleDataAsync(scope.ServiceProvider);
}

// use CORS
app.UseCors("ReactAppPolicy");

// Always enable Swagger for easier testing
app.UseSwagger();
app.UseSwaggerUI();

// Skip HTTPS redirection in Docker
// app.UseHttpsRedirection();

// Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

// map Controllers
app.MapControllers();

// Health check endpoint
app.MapGet("/", () => "Backend is running ✅");

app.Run();