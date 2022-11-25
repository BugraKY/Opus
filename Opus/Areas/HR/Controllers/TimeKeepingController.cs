using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using static Opus.Utility.ProjectConstant;
using System.Data;
using Opus.Models.ViewModels;

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
            //Extensions.SMTPExtension.SENDMAIL();



            var _staff = _uow.Staff.GetAll(i => i.Active && i.Status == 1);
            //var timeekeeping = _uow.TimeKeeping.GetAll().Where(i => (i.Year == DateTime.Now.Year && i.Month == 8));

            var timeKeeping = _uow.TimeKeeping.GetAll().Where(i => (i.Year == DateTime.Now.Year && i.Month == 8))
                .Join(_staff,
                t => t.StaffId,
                s => s.Id,
                (t, s) => new { timeKeepingg = t, stafff = s })
                .Select(t => new TimeKeepingVM
                {
                    Staff = t.stafff,
                    TimeKeeping = t.timeKeepingg
                }).OrderBy(n => n.Staff.FirstName);

            /*
            var _timeKeeping = timeKeeping.Select(t => new TimeKeepingVM
            {
                Staff=t.stafff,
                TimeKeeping=t.timeKeepingg
            });*/

            /*
            var personmotionAnonymous = _uow.StaffStamp.GetAll(includeProperties: "Staff,Stamp").Where(i => (i.Staff.Active && i.Staff.BlackList == false &&
            i.Staff.Status == 1 && i.Stamp.Lost == 0 && i.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000")))
            .Join(timeekeeping,
            s => s.StaffId,
            r => r.StaffId,
            (s, r) => new { staffStamp = s, timeKeeping = r })
            .Where(i => i.staffStamp.StaffId == i.timeKeeping.StaffId)
            .OrderBy(n => n.staffStamp.Staff.FirstName);
            */
            return View(timeKeeping);
        }

        [HttpGet]
        [Route("get-time-keeping")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible)]
        public object GetTimeKeeping()
        {
            var i = 0;
            var _staff = _uow.Staff.GetAll(i => i.Active && i.Status == 1);
            return _uow.TimeKeeping.GetAll().Where(i => (i.Year == DateTime.Now.Year && i.Month == 8))
                .Join(_staff,
                t => t.StaffId,
                s => s.Id,
                (t, s) => new { timeKeepingg = t, stafff = s })
                .Select(t => new TimeKeepingVM
                {
                    //Sequance.Sum(t.stafff.Status),
                    Staff = t.stafff,
                    TimeKeeping = t.timeKeepingg
                    })
                .OrderBy(n => n.Staff.FirstName);


        }
    }
}
