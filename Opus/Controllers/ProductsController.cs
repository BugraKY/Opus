using Microsoft.AspNetCore.Mvc;

namespace Opus.Controllers
{
    public class ProductsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
