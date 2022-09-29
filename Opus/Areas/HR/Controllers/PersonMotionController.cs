using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Opus.Utility.ProjectConstant;
using System.Data;
using Opus.DataAcces.IMainRepository;
using Microsoft.Extensions.Hosting;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class PersonMotionController : Controller
    {
        private readonly IUnitOfWork _uow;

        public PersonMotionController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("person-motion")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible)]
        public IActionResult Index()
        {

            /*
                         List<Staff> staffs = new List<Staff>();
            var staffResignation = _uow.StaffResignation.GetAll();

            var orn = _uow.Staff.GetAll()
                .Join(staffResignation,
                s => s.Id,
                r => r.StaffId,
                (s, r) => new { staffs = s, staffResignation = r })
                .Where(i => (i.staffs.Active && i.staffs.Status == 0) || (i.staffs.Active == false && i.staffs.Status == 1) && i.staffs.BlackList == false)
                .Select(s => s.staffs)
                .OrderBy(n => n.FirstName);



             
             
             */
            var _locations = _uow.Location.GetAll();
            var _motion = _uow.Staff.GetAll(i => (i.Status == 1 && i.Active && i.BlackList == false));

            return View(_motion);
        }
    }
}
