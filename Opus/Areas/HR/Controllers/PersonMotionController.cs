using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Opus.Utility.ProjectConstant;
using System.Data;
using Opus.DataAcces.IMainRepository;
using Microsoft.Extensions.Hosting;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;

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

            //List<Staff> staffs = new List<Staff>();
            //var staffStamp = _uow.StaffStamp.GetAll(i => i.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000"));
            var staffStamp = _uow.StaffStamp.GetAll(includeProperties: "Staff,Stamp");
            /*
            var orn = _uow.Staff.GetAll()
                .Join(staffStamp,
                s => s.Id,
                r => r.StaffId,
                (s, r) => new { staffs = s, staffStamp = r })
                .Where(i => (i.staffs.Active && i.staffs.Status == 1 && i.staffStamp.Stamp.Lost == 0 && i.staffStamp.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000")))
                .Select(s => s.staffStamp)
                .OrderBy(n => n.Staff.FirstName);
            */
            var orn = _uow.StaffStamp.GetAll(includeProperties: "Staff,Stamp").Where(i => (i.Staff.Active && i.Staff.BlackList == false &&
            i.Staff.Status == 1 && i.Stamp.Lost == 0 && i.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000"))).OrderBy(n => n.Stamp.Id);
            //var personmotiopn = (IEnumerable<PersonMotionVM>)orn;




            var _locations = _uow.Location.GetAll();
            var _motion = _uow.Staff.GetAll(i => (i.Status == 1 && i.Active && i.BlackList == false));

            return View(orn);
        }
    }
}
