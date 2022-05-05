using Microsoft.EntityFrameworkCore;
using Opus.DataAcces.Data;
using System.Configuration;
using Microsoft.Extensions.Configuration;
using Opus.Models.DbModels;
using Microsoft.AspNetCore.Identity;
using Opus.DataAcces.IMainRepository;
using Opus.DataAcces.MainRepository;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Globalization;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Builder;
using static Opus.Utility.ProjectConstant;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<AccountingDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("AccountingConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 6;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = false;
    options.Password.RequiredUniqueChars = 0;
})
    .AddDefaultTokenProviders()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddDataProtection();

builder.Services.AddMvc();
builder.Services.AddRazorPages().AddSessionStateTempDataProvider();
//services.AddRazorPages();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(10);
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = $"/signin";
    //options.LogoutPath = $"/Identity/Accout/Logout";
    options.AccessDeniedPath = $"/";
});
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation().AddSessionStateTempDataProvider();
/*
builder.Services.AddLogging(
    builder =>
    {
        builder.AddFilter("Microsoft", LogLevel.Warning)
        .AddFilter("System", LogLevel.Warning)
        .AddFilter("NToastNotify", LogLevel.Warning)
        .AddConsole();
    });
*/

var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.Use(async (context, next) =>
{
    await next();
    if (context.Response.StatusCode == 404)
    {
        context.Request.Path = "/";
        await next();
    }
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseCookiePolicy();
app.UseSession();
/*
app.UseCors(builder =>
{
    builder.WithOrigins("https://manypointscreative.com", "http://manypointscreative.com").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
});*/
/*
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseCookiePolicy();
app.UseSession();*/
app.UseDeveloperExceptionPage();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

Console.WriteLine("IPV4: " + GetAllLocalIPv4().FirstOrDefault());
app.Run();











/*
var _addresses = app.ServerFeatures.Get<IServerAddressesFeature>().Addresses;
AppConfig.Localhost = _addresses;*/
/*
Console.ForegroundColor = ConsoleColor.Green;
var HostString = "";
foreach (var item in AppConfig.Localhost)
{
    HostString += "\n" + item;
}
Console.WriteLine("Opus Running. LocalHost: " + HostString);
Console.WriteLine("IPV4: " + GetAllLocalIPv4().FirstOrDefault());
Console.ForegroundColor = ConsoleColor.White;
*/