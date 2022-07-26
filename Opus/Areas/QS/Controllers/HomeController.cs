using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using static Opus.Utility.ProjectConstant;

namespace Opus.Areas.QS.Controllers
{
    [Area("QS")]
    public class HomeController : Controller
    {
        [Route("qs")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
