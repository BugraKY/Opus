using Microsoft.AspNetCore.Mvc;

namespace Opus.Controllers
{
    public class StaffController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
