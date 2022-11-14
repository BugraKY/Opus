using Abp.Net.Mail;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using System.Text.Encodings.Web;
using System.Text;
using static Opus.Utility.ProjectConstant;
using System.Data;
using Opus.Utility;
using System.Security.Claims;
using Opus.Models.DbModels.ReferenceVerifDb;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible)]
    public class AppUserController : Controller
    {
        private readonly IUnitOfWork _uow;
        private readonly UserManager<ApplicationUser> _umgr;
        private readonly RoleManager<IdentityRole> _rmgr;
        private readonly ILogger<ApplicationUser> _logger;
        public AppUserController(IUnitOfWork uow, UserManager<ApplicationUser> umgr, RoleManager<IdentityRole> rmgr, ILogger<ApplicationUser> logger)
        {
            _uow = uow;
            _umgr = umgr;
            _rmgr = rmgr;
            _logger = logger;
        }
        [Route("app-users")]
        [Authorize]
        public IActionResult Index()
        {
            //var _appUser=

            var users = _uow.ApplicationUser.GetAll().Select(c => new ApplicationUser()
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.UserName,
                UserRole = string.Join(",", _umgr.GetRolesAsync(c).Result.ToArray())
            }).OrderBy(i => i.FirstName);
            /*
            var users = _umgr.Users.Select(c => new ApplicationUser()
            {
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.UserName,
                UserRole = string.Join(",", _umgr.GetRolesAsync(c).Result.ToArray())
            }).OrderBy(i => i.FirstName);*/
            var _appuserVM = new AppUserVM
            {
                //IdentityRole = _rmgr.Roles.Select(n=>n.Name),
                Roles = _rmgr.Roles,
                ApplicationUsersEnumeralbe = users
            };
            return View(_appuserVM);
        }
        [HttpPost("app-users")]
        public async Task<IActionResult> OnPostAsync(AppUserVM Input)
        {
            var _currentuser = _uow.ApplicationUser.GetFirstOrDefault(i => i.Id == GetClaim().Value);
            var _loguser = _currentuser.UserName + " - " + DateTime.Now.ToString("dd.MM.yyyy");
            Input.SelectedRole = _rmgr.Roles.FirstOrDefault(i=>i.Id==Input.SelectedRole.Id);
            //Input.SelectedRole = _rmgr.
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = Input.AppMail,
                    Email = Input.AppMail,
                    FirstName = Input.AppFirstName,
                    LastName = Input.AppLastName,
                    EmailConfirmed = true,
                };
                var _adduserLOG = "Added User and Role .. User name(" + user.UserName + ")" + " Role name(" + Input.SelectedRole.Name + ")" + " by " + _loguser;
                return NoContent();
                var result = await _umgr.CreateAsync(user, Input.AppPass);
                if (result.Succeeded)
                {
                    if (!await _rmgr.RoleExistsAsync(UserRoles.Admin))
                    {
                        await _rmgr.CreateAsync(new IdentityRole(UserRoles.Admin));
                    }
                    if (!await _rmgr.RoleExistsAsync(UserRoles.HR_Responsible))
                    {
                        await _rmgr.CreateAsync(new IdentityRole(UserRoles.HR_Responsible));
                    }
                    if (!await _rmgr.RoleExistsAsync(UserRoles.OperationResponsible))
                    {
                        await _rmgr.CreateAsync(new IdentityRole(UserRoles.OperationResponsible));
                    }
                    if (!await _rmgr.RoleExistsAsync(UserRoles.Accounting))
                    {
                        await _rmgr.CreateAsync(new IdentityRole(UserRoles.Accounting));
                    }
                    if (!await _rmgr.RoleExistsAsync(UserRoles.FieldOfficer))
                    {
                        await _rmgr.CreateAsync(new IdentityRole(UserRoles.FieldOfficer));
                    }
                    if (!await _rmgr.RoleExistsAsync(UserRoles.ProjectResponsible))
                    {
                        await _rmgr.CreateAsync(new IdentityRole(UserRoles.ProjectResponsible));
                    }
                    if (!await _rmgr.RoleExistsAsync(UserRoles.QS_Operation))
                    {
                        await _rmgr.CreateAsync(new IdentityRole(UserRoles.QS_Operation));
                    }
                    if (!await _rmgr.RoleExistsAsync(UserRoles.TrainingRegistrationResp))
                    {
                        await _rmgr.CreateAsync(new IdentityRole(UserRoles.TrainingRegistrationResp));
                    }

                    _logger.LogInformation(_adduserLOG);
                    return Redirect("/opus-users");


                    /*
                    var code = await _umgr.GenerateEmailConfirmationTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    var callbackUrl = Url.Page(
                        "/Account/ConfirmEmail",
                        pageHandler: null,
                        values: new { area = "Identity", userId = user.Id, code = code },
                        protocol: Request.Scheme);

                    await _emailSender.SendEmailAsync(Input.Email, "Confirm your email",
                        $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

                    */

                    /*
                    if (_umgr.Options.SignIn.RequireConfirmedAccount)
                    {
                        return RedirectToPage("RegisterConfirmation",
                                              new { email = Input.AppMail });
                    }
                    else
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return LocalRedirect(returnUrl);
                    }*/
                }
            }
            return NoContent();
        }
        [Route("app-users/edit/{id}")]
        public IActionResult Edit(string id)
        {
            var _appUser = _uow.ApplicationUser.GetFirstOrDefault(i => i.Id == id);
            var _appUserVM = new AppUserVM()
            {
                AppFirstName = _appUser.FirstName,
                AppLastName = _appUser.LastName,
                AppMail = _appUser.Email
            };
            return View(_appUserVM);
        }
        public IActionResult EditPost(AppUserVM Input)
        {
            return Redirect("/app-users/edit/" + Input.Id);
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
