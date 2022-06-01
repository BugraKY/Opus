using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Opus.Utility.ProjectConstant;

namespace Opus.Areas.Accounting.Controllers
{
    [Area("Accounting")]
    [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Accounting)]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult SelectComp()
        {
            return View();
        }
    }
}
