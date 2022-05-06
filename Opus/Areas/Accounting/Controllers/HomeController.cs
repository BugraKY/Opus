using Microsoft.AspNetCore.Mvc;

namespace Opus.Areas.Accounting.Controllers
{
    [Area("Accounting")]
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
