using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Opus.Areas.HR.Controllers;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using Opus.Models.DbModels.ReferenceVerifDb;
using static Opus.Utility.ProjectConstant;

namespace Opus.Areas.QS.Controllers
{
    [Area("QS")]
    public class RVController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IUnitOfWork _uow;
        private readonly ILogger<RVController> _logger;
        public RVController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IUnitOfWork uow, ILogger<RVController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _uow = uow;
            _logger = logger;
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [Route("qs/references-verif")]
        public IActionResult Index()
        {
            return View(_uow.ReferenceVerif_Company.GetAll(a => a.Active));
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("qs/references-verify/add-comp")]
        public IActionResult PostCompany(string CompanyName)
        {
            var _company = new Company()
            {
                Name = CompanyName,
                Active = true,
            };
            if (_uow.ReferenceVerif_Company.GetFirstOrDefault(n => n.Name == CompanyName) == null)
            {
                _uow.ReferenceVerif_Company.Add(_company);
                _uow.Save();
                return RedirectToAction("Index");
            }
            else
                return NoContent();

        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpGet("api/qs/get-verif")]
        public IEnumerable<Verifications> GetVerifications()
        {
            return _uow.ReferenceVerif_Verification.GetAll(includeProperties:"Company").Where(a=>a.Company.Active);
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("api/qs/post-ref")]
        public bool PostReference([FromBody] Verifications verification)
        {
            //Live
            //Out of life
            _uow.ReferenceVerif_Verification.Add(verification);
            _uow.Save();
            return true;
        }
    }
}
