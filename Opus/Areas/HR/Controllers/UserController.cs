using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using System.Data;
using static Opus.Utility.Enums;
using static Opus.Utility.ProjectConstant;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible)]
    public class UserController : Controller
    {
        private readonly IUnitOfWork _uow;
        private readonly IWebHostEnvironment _hostEnvironment;

        public UserController(IUnitOfWork uow, IWebHostEnvironment hostEnvironment)
        {
            _uow = uow;
            _hostEnvironment = hostEnvironment;
        }
        [Route("users/")]
        public IActionResult Index()
        {
            IEnumerable<Staff> _users = _uow.Staff.GetAll().Where(a => (a.Active && a.Status==1));
            return View(_users);
        }
        [Route("users/staff")]
        public IActionResult StaffIndex()
        {
            return View();
        }
    }
}
