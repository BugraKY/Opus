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
using System.Net.WebSockets;
using System.Net;
using System.Text;
using Opus.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation().AddViewComponentsAsServices();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<AccountingDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("AccountingConnection")));

builder.Services.AddDbContext<ReferenceVerifDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("ReferenceVerifConnection")));

builder.Services.AddDbContext<ReferenceVerifLOGContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("ReferenceVerifLOGConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 6;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = true;
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
builder.Services.AddControllers(options => options.EnableEndpointRouting = false);//testing

/*
builder.Services.AddSignalR(options => 
{
    options.EnableDetailedErrors = true;//hata detayý açýk veya kapalý. Debug için olabilir!!!----------------------------------------------------------------------------------
});*/
/*
builder.Services.AddSignalR()
    .AddJsonProtocol(options => {
        options.PayloadSerializerOptions.PropertyNamingPolicy = null;
    });

*/
builder.Services.AddSignalR();


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
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(5)
};

app.Use(async (context, next) =>
{
    await next();
    /*
    if (context.Response.StatusCode == 404)
    {
        context.Request.Path = "/";
        await next();
    }
    else
    {
        await next(context);
    }

    */
    /*
    if (context.Request.Path == "/send")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            using (WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync())
            {
                await Send(context, webSocket);
            }
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }
    */


});
/*
async Task Send(HttpContext context, WebSocket webSocket)
{
    var buffer = new byte[1024 * 4];
    WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    while (!result.CloseStatus.HasValue)
    {
        await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);
        result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    }
    await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
}
*/


/*
Task Send(WebSocket webSocket)
{
    var buffer = new byte[1024 * 4];
    var receiveResult = await webSocket.ReceiveAsync(
        new ArraySegment<byte>(buffer), CancellationToken.None);

    while (!receiveResult.CloseStatus.HasValue)
    {
        await webSocket.SendAsync(
            new ArraySegment<byte>(buffer, 0, receiveResult.Count),
            receiveResult.MessageType,
            receiveResult.EndOfMessage,
            CancellationToken.None);

        receiveResult = await webSocket.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);
    }

    await webSocket.CloseAsync(
        receiveResult.CloseStatus.Value,
        receiveResult.CloseStatusDescription,
        CancellationToken.None);
}
*/
//app.UseWebSockets(webSocketOptions);

Console.OutputEncoding=System.Text.Encoding.UTF8;

app.UseHttpsRedirection();
Console.WriteLine("Https Redirection Started.");
app.UseStaticFiles();
Console.WriteLine("Static Files Started.");
app.UseRouting();
Console.WriteLine("Routing Started.");
app.UseAuthentication();
Console.WriteLine("Authentication Started.");
app.UseAuthorization();
Console.WriteLine("Authorization Started.");
app.UseCookiePolicy();
Console.WriteLine("Cookie Policy Started.");
app.UseSession();
Console.WriteLine("Sessions Started.");

//app.UseFileServer();//testing..
//app.usesi

/*
app.UseCors(builder =>
{
    builder.WithOrigins("https://localhost:5001", "http://localhost:5000").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
});
*/

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
app.MapHub<OpusHub>("/hubs");

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Hub Started with Web Socket.");
Console.ForegroundColor = ConsoleColor.White;

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("---------------------------------------------------------------");
Console.ForegroundColor = ConsoleColor.White;

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("");
Console.WriteLine("API STARTED!");
Console.WriteLine("");
Console.Write("LOCAL IPV4: ");
Console.ForegroundColor = ConsoleColor.White;

Console.WriteLine(GetAllLocalIPv4().FirstOrDefault());


Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Opus is working..");
Console.WriteLine("---------------------------------------------------------------");
Console.ForegroundColor = ConsoleColor.White;
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