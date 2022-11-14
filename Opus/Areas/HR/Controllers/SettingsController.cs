using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Opus.Utility.ProjectConstant;
using System.Data;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class SettingsController : Controller
    {
        [Route("settings")]
        [Authorize(Roles = UserRoles.Admin)]
        public IActionResult Index()
        {
            return View();
        }
    }
}
