using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Opus.Areas.HR.Controllers;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using Opus.Models.DbModels.ReferenceVerifDb;
using System.Text;
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
        [Route("qs/references-verify/edit-user/{id}")]
        public IActionResult EditUser(string id)
        {
            return View(_uow.ReferenceVerif_User.GetFirstOrDefault(i => i.Id == Guid.Parse(id)));
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("qs/references-verify/edit-user/post/")]
        public IActionResult EditUserPost(User user)
        {
            _uow.ReferenceVerif_User.Update(user);
            _uow.Save();
            return Redirect("/qs/references-verify/edit-user/" + user.Id);
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpGet("api/qs/rv/get-verif")]
        public IEnumerable<Verifications> GetVerifications()
        {
            return _uow.ReferenceVerif_Verification.GetAll(includeProperties: "Company").Where(a => a.Company.Active);
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpGet("api/qs/rv/get-userlist")]
        public IEnumerable<User> GetUsers()
        {
            return _uow.ReferenceVerif_User.GetAll();
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("api/qs/rv/post-ref")]
        public bool PostReference([FromBody] Verifications verification)
        {
            //Live
            //Out of life
            _uow.ReferenceVerif_Verification.Add(verification);
            _uow.Save();
            return true;
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("api/qs/rv/generate-pass")]
        public string GeneratePassword([FromBody] string key)
        {
            var length = 6;
            StringBuilder res = new StringBuilder();
            /*
            var _password = "";
            if (key == "vasd7564as52d9c7s")
            {
                _password = Guid.NewGuid().ToString().Replace("-", "").Substring(1,6);
            }
            return _password;
            */
            if (key == "vasd7564as52d9c7s")
            {
                const string valid = "abcdefghijkmnopqrstuvwxyz1234567890";

                Random rnd = new Random();
                while (0 < length--)
                {
                    res.Append(valid[rnd.Next(valid.Length)]);
                }

            }
            return res.ToString();
        }

        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("api/qs/rv/post-user")]
        public bool PostReference([FromBody] User _user)
        {
            var check = _uow.ReferenceVerif_User.GetFirstOrDefault(i => i.UserName == _user.UserName);
            if (check == null)
            {
                _uow.ReferenceVerif_User.Add(_user);
                _uow.Save();
                return true;
            }
            return false;


        }
    }

}
