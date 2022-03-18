using Microsoft.AspNetCore.Mvc;

namespace Opus.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        [Route("signin")]
        public IActionResult SignIn()
        {
            return View();
        }
        [Route("signup")]
        public IActionResult SignUp()
        {
            return View();
        }
        /*
        [HttpPost]
        public IActionResult SignUp()
        {
            return View();
        }*/
    }
}
