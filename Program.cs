using FFnF_Request.Models;
using FFnF_Request.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<JWTService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["jwtconfig:key"])),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Cookies["Token"];
            if (!string.IsNullOrEmpty(accessToken))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
//{
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuerSigningKey = true,
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["jwtconfig:key"])),
//        ValidateIssuer = false, // Set to true if you are using an issuer
//        ValidateAudience = false, // Set to true if you have a specific audience
//        ClockSkew = TimeSpan.Zero
//    };
//    options.Events = new JwtBearerEvents
//    {
//        OnTokenValidated = context =>
//        {
//            // Additional validation can go here
//            return Task.CompletedTask;
//        }
//    };
//});

builder.Services.AddDbContext<ApplicationContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("ConString"))
);

var app = builder.Build();

app.UseStaticFiles();

//app.Use(async (context, next) =>
//{
//    var path = context.Request.Path;
//    if (!path.StartsWithSegments("/api") && path != "/auth/login")
//    {
//        if (!context.User.Identity.IsAuthenticated)
//        {
//            // Check for cookie
//            var token = context.Request.Cookies["Token"];
//            if (string.IsNullOrEmpty(token))
//            {
//                // No token found, redirect to Login
//                context.Response.Redirect("/auth/login");
//                return;
//            }
//        }
//    }

//    await next();
//});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=auth}/{action=login}/{id?}");

app.Run();
