using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using System.Security.Claims;
using Opus.Extensions;
using static Opus.Utility.ProjectConstant;
using Microsoft.AspNetCore.Identity;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class HomeController : Controller
    {
        private readonly IUnitOfWork _uow;
        private readonly IWebHostEnvironment _hostEnvironment;//wwwroot konum olarak erişim sağlar. Yani host dosyamızın ana dosyasına erişilir.
        private readonly RoleManager<IdentityRole> _roleManager;
        public HomeController(IUnitOfWork uow, IWebHostEnvironment hostEnvironment, RoleManager<IdentityRole> roleManager)
        {
            _uow = uow;
            _hostEnvironment = hostEnvironment;
            _roleManager = roleManager;
        }
        [Route("/")]
        public IActionResult Index()
        {
            #region Authentication Index
            if (GetClaim() != null)
            {
                return Redirect("/dashboard");//Go Dashboard
            }
            return Redirect("/signin");
            //return RedirectToAction("SignIn", "Account")
            #endregion Authentication Index
        }
        [Route("dashboard")]
        public IActionResult Dashboard()
        {
            if (GetClaim() != null)
            {
                return View();
            }
            return Redirect("/signin");
        }
        public Claim GetClaim()
        {
            var claimsIdentity = (ClaimsIdentity)User.Identity;
            var Claims = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier);
            if (Claims != null)
            {
                return Claims;
            }
            return null;
        }
        [HttpGet("get-test")]
        public JsonResult Test()
        {
            var _object = _uow.Location.GetAll();
            return Json(_object);
        }
    }
}
