using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using System.Security.Claims;

namespace Opus.Controllers
{
    public class HomeController : Controller
    {
        private readonly IUnitOfWork _uow;
        public HomeController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        public IActionResult Index()
        {
            #region Authentication Index
            if (GetClaim() != null)
            {
                return RedirectToAction("Dashboard", "Home");//Go Dashboard
            }
            return Redirect("/signin");
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
