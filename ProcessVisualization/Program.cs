using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProcessVisualization.Api.Data;
using ProcessVisualization.Api.Host.Extensions;
using ProcessVisualization.Api.Business.Extensions;
using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Business.Services;
using System.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ProcessVisualization.Api.Data.Models;
using ProcessVisualization.Api.Host.Hubs;

var builder = WebApplication.CreateBuilder(args);

IWebHostEnvironment environment = builder.Environment;
IConfiguration configuration = builder.Configuration;

const string CorsPolicy = "CorsPolicy";

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("SqlConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddControllers().AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null);
builder.Services.AddSignalR();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddIdentity<User, IdentityRole>(options => {
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;

}).AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(auth =>
{
    auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = configuration["Jwt:validIssuer"],
        ValidateAudience = true,
        ValidAudience = configuration["Jwt:validAudience"],
        ValidateLifetime = true,
        RequireExpirationTime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:IssuerSigninKey"]))
    };
});

builder.Services.RegisterApiServices(configuration, environment);


builder.Services.AddCors(options => {
    options.AddPolicy(CorsPolicy, corsOptions =>
    {
        corsOptions.AllowAnyHeader();
        corsOptions.AllowAnyMethod();
        corsOptions.AllowAnyOrigin();
        corsOptions.SetIsOriginAllowed((hosts) => true);
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicy);

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<EditorHub>("editorhub");
app.MapHub<ChatHub>("/chatHub");

app.MapControllers();

app.ConfigureBusinessServices(app.Environment);

app.Run();
