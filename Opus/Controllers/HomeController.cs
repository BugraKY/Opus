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
            var claimsIdentity = (ClaimsIdentity)User.Identity;
            var Claims = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier);
            if (Claims != null)
            {
                return RedirectToAction("Dashboard", "Home");//Go Dashboard
            }
            return Redirect("/signin");
            #endregion Authentication Index
            
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
