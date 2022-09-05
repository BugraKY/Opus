using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Opus.DataAcces.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Opus.DataAcces.IMainRepository;
using Opus.DataAcces.MainRepository;
using Opus.Models.DbModels;
using Microsoft.AspNetCore.Hosting.Server.Features;
using static Opus.Utility.ProjectConstant;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Globalization;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Opus
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
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

            services.AddDataProtection();

            services.AddMvc();
            services.AddRazorPages().AddSessionStateTempDataProvider();
            //services.AddRazorPages();
            services.AddHttpContextAccessor();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromHours(10);
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped<IUnitOfWork, IUnitofwork>();
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddControllersWithViews().AddRazorRuntimeCompilation().AddSessionStateTempDataProvider();
            services.AddLogging(
                builder =>
                {
                    builder.AddFilter("Microsoft", LogLevel.Warning)
                    .AddFilter("System", LogLevel.Warning)
                    .AddFilter("NToastNotify", LogLevel.Warning)
                    .AddConsole();
                });
            //var baseUrl = Request.GetTypedHeaders().Referer.ToString();
            var cultures = new List<CultureInfo> {
                new CultureInfo("en"),
                new CultureInfo("tr")
            };

        }
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            var _addresses = app.ServerFeatures.Get<IServerAddressesFeature>().Addresses;
            AppConfig.Localhost = _addresses;
            /*
            foreach (var item in _addresses)
            {
                AppConfig.Localhost.Add(item);
            }*/

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCookiePolicy();
            app.UseSession();
            /*
            app.UseSession(new SessionOptions()
            {
                Cookie = new CookieBuilder()
                {
                    Name = ".AspNetCore.Session.ProjectFollower"
                }
            });
            */
            app.UseAuthentication();
            app.UseAuthorization();
            /*
            app.UseCors(builder =>
            {
                builder.WithOrigins("https://manypointscreative.com", "http://manypointscreative.com").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
            });*/
            /*
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
            });*/
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            Console.ForegroundColor = ConsoleColor.Green;
            var HostString = "";
            foreach (var item in AppConfig.Localhost)
            {
                HostString += "\n" + item;
            }
            Console.WriteLine("Opus Running. LocalHost: " + HostString);
            Console.WriteLine("IPV4: " + GetAllLocalIPv4().FirstOrDefault());
            Console.ForegroundColor = ConsoleColor.White;
        }
        public static string[] GetAllLocalIPv4()
        {
            List<string> ipAddrList = new List<string>();
            foreach (NetworkInterface item in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (item.NetworkInterfaceType == NetworkInterfaceType.Ethernet && item.OperationalStatus == OperationalStatus.Up)
                {
                    foreach (UnicastIPAddressInformation ip in item.GetIPProperties().UnicastAddresses)
                    {
                        if (ip.Address.AddressFamily == AddressFamily.InterNetwork)
                        {
                            ipAddrList.Add(ip.Address.ToString());
                        }
                    }
                }
                else if (item.NetworkInterfaceType == NetworkInterfaceType.Wireless80211 && item.OperationalStatus == OperationalStatus.Up)
                {
                    foreach (UnicastIPAddressInformation ip in item.GetIPProperties().UnicastAddresses)
                    {
                        if (ip.Address.AddressFamily == AddressFamily.InterNetwork)
                        {
                            ipAddrList.Add(ip.Address.ToString());
                        }
                    }
                }
            }
            return ipAddrList.ToArray();
        }
    }
}
