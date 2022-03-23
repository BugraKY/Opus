using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.ViewModels;
using System.Security.Claims;
using static Opus.Utility.Enums;

namespace Opus.Controllers
{
    public class StaffController : Controller
    {
        private readonly IUnitOfWork _uow;
        public StaffController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("staff")]
        public IActionResult Index()
        {
            #region Authentication
            if (GetClaim() != null)
            {
                var staffs=_uow.Staff.GetAll();
                ViewBag.TotalActive = staffs.Where(x => x.Status == (int)StatusOfStaff.Active).Count();
                ViewBag.TotalPassive = staffs.Where(x => x.Status == (int)StatusOfStaff.Passive).Count();
                ViewBag.TotalExit = staffs.Where(x => x.Status == (int)StatusOfStaff.Quit).Count();
                return View(staffs);
            }
            return NotFound();
            #endregion Authentication
        }
        [Route("staff/add")]
        public IActionResult Add()
        {
            #region Authentication
            if (GetClaim() != null)
            {
                return View();//Go Dashboard
            }
            return NotFound();
            #endregion Authentication
        }
        [HttpPost("staff/add")]
        public async Task<IActionResult> AddAsync(StaffVM staff)
        {
            await Task.Delay(1);
            var deg = staff;
            return NoContent();
            #region Authentication
            if (GetClaim() != null)
            {
                return View();//Go Dashboard
            }
            return NotFound();
            #endregion Authentication
        }
        public Claim GetClaim()
        {
            var claimsIdentity = (ClaimsIdentity)User.Identity;
            var Claims = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier);
            if (Claims != null)
            {
                return Claims;
            }
            return null;
        }
    }
}
