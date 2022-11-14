using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using static Opus.Utility.ProjectConstant;
using System.Data;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class TimeKeepingController : Controller
    {
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IUnitOfWork _uow;

        public TimeKeepingController(IWebHostEnvironment hostEnvironment, IUnitOfWork uow)
        {
            _hostEnvironment = hostEnvironment;
            _uow = uow;
        }
        [Route("time-keeping")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible)]
        public IActionResult Index()
        {
            var _staff = _uow.Staff.GetAll(i => i.Active && i.Status == 1);
            return View();
        }
    }
}
