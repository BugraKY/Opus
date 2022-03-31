using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Opus.Utility.ProjectConstant;

namespace Opus
{
    public class Program
    {
        /*
        private static IHttpContextAccessor m_httpContextAccessor;
        public static HttpContext Current => m_httpContextAccessor.HttpContext;
        public static string AppBaseUrl => $"{Current.Request.Scheme}://{Current.Request.Host}{Current.Request.PathBase}";
        public Program(IHttpContextAccessor contextAccessor)
        {
            m_httpContextAccessor = contextAccessor;
        }*/
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    try
                    {
                        webBuilder.UseStartup<Startup>();
                    }
                    catch (Exception e)
                    {

                        Console.ForegroundColor = ConsoleColor.DarkRed;
                        Console.WriteLine("Error: "+e.Message+"\nCode: "+e.HResult+"\n\nSource: \n"+e.StackTrace);
                        Console.ForegroundColor = ConsoleColor.White;
                    }
                });
    }
}
