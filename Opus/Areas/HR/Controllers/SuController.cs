using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using static Opus.Utility.ProjectConstant;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    [Authorize(Roles = UserRoles.Admin)]
    public class SuController : Controller//Super User Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUnitOfWork _uow;
        private readonly ILogger<SuController> _logger;

        public SuController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,RoleManager<IdentityRole> roleManager, IUnitOfWork uow, ILogger<SuController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _uow = uow;
            _logger = logger;
        }
        [Route("add-admin")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost("add-admin")]
        public async Task<IActionResult> RegisterAdmin(AddAdminVM userVM)
        {
            bool posted = true;

            if (ModelState.IsValid)
            {
                //var user = new IdentityUser { UserName = Input.Email, Email = Input.Email };

                var _user = new ApplicationUser
                {
                    FirstName=userVM.FirstName,
                    LastName=userVM.LastName,
                    AppUserName=userVM.AppUserName,
                    UserName = userVM.Email,
                    Email = userVM.Email,
                    Active=true,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(_user, userVM.Password);
                if (result.Succeeded)
                {
                    _logger.LogInformation("Süper kullanıcıdan yönetici eklendi.");
                    if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
                    }
                    if (!await _roleManager.RoleExistsAsync(UserRoles.HR_Responsible))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.HR_Responsible));
                    }
                    if (!await _roleManager.RoleExistsAsync(UserRoles.OperationResponsible))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.OperationResponsible));
                    }
                    if (!await _roleManager.RoleExistsAsync(UserRoles.Accounting))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.Accounting));
                    }
                    if (!await _roleManager.RoleExistsAsync(UserRoles.FieldOfficer))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.FieldOfficer));
                    }
                    if (!await _roleManager.RoleExistsAsync(UserRoles.ProjectResponsible))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.ProjectResponsible));
                    }
                    if (!await _roleManager.RoleExistsAsync(UserRoles.QS_Operation))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.QS_Operation));
                    }
                    
                    _logger.LogInformation("Admin account creating by 'Super Admin'");
                    await _userManager.AddToRoleAsync(_user, UserRoles.Accounting);


                    if (_userManager.Options.SignIn.RequireConfirmedAccount)
                    {
                        //return RedirectToPage("RegisterConfirmation", new { email = Input.Email, returnUrl = "~/" });
                        return RedirectToAction("SuccessResult", posted);
                        //return Redirect("~/");
                    }
                    else
                    {
                        await _signInManager.SignInAsync(_user, isPersistent: false);
                        return NoContent();//Success
                    }
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

            }

            // If we got this far, something failed, redisplay form

            return LocalRedirect("/");
        }
    }
}
