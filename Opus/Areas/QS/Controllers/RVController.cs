using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Opus.Areas.HR.Controllers;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using Opus.Models.DbModels.ReferenceVerifDb;
using System.Text;
using Opus.Models.ViewModels.ReferenceVerif;
using static Opus.Utility.ProjectConstant;
using Opus.Models.DbModels.ReferenceVerifLOG;
using System.Security.Claims;

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
            var _models = new AllModelsVM()
            {
                Companies = _uow.ReferenceVerif_Company.GetAll(a => a.Active).OrderBy(N => N.Name),
                Customers = _uow.ReferenceVerif_Customer.GetAll(a => a.Active, includeProperties: "Company").OrderBy(N => N.Company.Name)
            };
            return View(_models);
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("qs/references-verify/add-cust")]
        public IActionResult PostCustomer(AllModelsVM allModels)
        {
            var _comp = _uow.ReferenceVerif_Company.GetFirstOrDefault(i => i.Id == allModels.Company.Id);
            var _customer = new Customer()
            {
                CompanyId = allModels.Company.Id,
                Active = true,
            };
            if (_uow.ReferenceVerif_Customer.GetFirstOrDefault(n => n.CompanyId == _customer.Id) == null)
            {
                _uow.ReferenceVerif_Customer.Add(_customer);
                _uow.Save();
                return RedirectToAction("Index");
            }
            else
                return NoContent();

        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("qs/references-verify/add-comp")]
        public IActionResult PostCompany(AllModelsVM modelsVM)
        {
            var _company = new Opus.Models.DbModels.ReferenceVerifDb.Company()
            {
                Name = modelsVM.Company.Name,
                Active = true,
            };
            if (_uow.ReferenceVerif_Company.GetFirstOrDefault(n => n.Name == _company.Name) == null)
            {
                _uow.ReferenceVerif_Company.Add(_company);
                _uow.Save();
                return RedirectToAction("Index");
            }
            else
                return NoContent();

        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("qs/references-verify/add-cust-def")]
        public IActionResult PostCustomerDef(AllModelsVM modelsVM)
        {
            var _customerDef = new CustomerDefinitions()
            {
                CompanyId = modelsVM.CustomerDefinitions.CompanyId,
                CustomerId = modelsVM.CustomerDefinitions.CustomerId,
            };
            if (_uow.ReferenceVerif_CustomerDefinitions.GetFirstOrDefault(n => (n.CustomerId == _customerDef.CustomerId && n.CompanyId == _customerDef.CompanyId)) == null)
            {
                _uow.ReferenceVerif_CustomerDefinitions.Add(_customerDef);
                _uow.Save();
                return RedirectToAction("Index");
            }
            else
                return NoContent();

        }
        /*PostCustomerDef*/
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
        [Route("qs/references-verify/reference-definitions/{id}")]
        public IActionResult ReferenceDefs(string id)
        {
            var _user = _uow.ReferenceVerif_User.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
            _user = new User()
            {
                UserName = _user.UserName,
                //FullName = _user.FullName,
                //FullName = _user.Staff.FirstName + " " + _user.Staff.LastName,
                Id = _user.Id
            };
            var referenceDefs = new ReferenceDefsIndexVM()
            {
                Enum_ReferenceDefinitions = _uow.ReferenceVerif_ReferenceDefinitions.GetAll(i => i.UserId == Guid.Parse(id), includeProperties: "Verifications"),
                Enum_References = _uow.ReferenceVerif_Verification.GetAll(a => a.Active),
                User = _user,
                UserId = _user.Id.ToString()
            };
            //var _definitions = _uow.ReferenceVerif_ReferenceDefinitions.GetAll(i => i.UserId == Guid.Parse(id));
            return View(referenceDefs);
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("qs/references-verify/reference-definitions/add")]
        public IActionResult AddDef(ReferenceDefsIndexVM referenceDefinitions)
        {
            var _user = _uow.ReferenceVerif_User.GetFirstOrDefault(i => i.Id == Guid.Parse(referenceDefinitions.UserId));
            var _reference = _uow.ReferenceVerif_Verification.GetFirstOrDefault(i => i.Id == Guid.Parse(referenceDefinitions.RefId));
            var _COUNT = _uow.ReferenceVerif_ReferenceDefinitions.GetAll(i => (i.VerificationsId == Guid.Parse(referenceDefinitions.RefId) && i.UserId == Guid.Parse(referenceDefinitions.UserId))).Count();
            if (_COUNT < 1)
            {
                var referenceDefs = new ReferenceDefinitions()
                {
                    UserId = Guid.Parse(referenceDefinitions.UserId),
                    VerificationsId = Guid.Parse(referenceDefinitions.RefId)
                };
                _uow.ReferenceVerif_ReferenceDefinitions.Add(referenceDefs);
                _uow.Save();
            }
            return Redirect("/qs/references-verify/reference-definitions/" + referenceDefinitions.UserId);
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [Route("qs/references-verify/reference-definitions/{id}/del/{refid}")]
        public IActionResult DelDef(string id, string refid)
        {
            _uow.ReferenceVerif_ReferenceDefinitions.Remove(_uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(i => i.Id == Guid.Parse(refid)));
            _uow.Save();

            return Redirect("/qs/references-verify/reference-definitions/" + id);
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpGet("api/qs/rv/get-verif")]
        public IEnumerable<Verifications> GetVerifications()
        {
            //return _uow.ReferenceVerif_Verification.GetAll(includeProperties: "Company").Where(a => a.Company.Active);
            var test = _uow.ReferenceVerif_Verification.GetAll(includeProperties: "CustomerDefinitions.Company,CustomerDefinitions.Customer.Company");
            return _uow.ReferenceVerif_Verification.GetAll(includeProperties: "CustomerDefinitions.Company,CustomerDefinitions.Customer.Company");
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpGet("api/qs/rv/get-userlist")]
        public IEnumerable<User> GetUsers()
        {
            IEnumerable<User> test = null;
            try
            {
                test = _uow.ReferenceVerif_User.GetAll();
            }
            catch (Exception ex)
            {
                var _appuser = _uow.ApplicationUser.GetFirstOrDefault(i => i.Id == GetClaim().Value);
                var _appuserInfo = "USER: "+_appuser.Id + " || " + _appuser.FirstName + " " + _appuser.LastName +"( "+DateTime.Now.ToString("dd/MM/yyyy")+ " - "+ DateTime.Now.ToString("HH:mm:ss") + " )";

                //Console.WriteLine("");
                Console.ForegroundColor = ConsoleColor.Red;
                Console.Write("Hata: ");
                Console.ForegroundColor = ConsoleColor.White;
                if (ex.InnerException != null)
                    Console.WriteLine(ex.InnerException.Message + " - "+_appuserInfo);
                else
                    Console.WriteLine(ex.Message + " - " + _appuserInfo);
            }
            return test;
        }
        [HttpGet("api/qs/rv/get-custDef/{cusId}")]
        public IEnumerable<CustomerDefinitions> GetCustDefs(string cusId)
        {
            var test = _uow.ReferenceVerif_CustomerDefinitions.GetAll(includeProperties: "Company,Customer.Company").Where(i=>i.CustomerId==Guid.Parse(cusId));
            return test;
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpGet("api/qs/rv/get-user/{id}")]
        public User GetUser(string id)
        {
            var _user = _uow.ReferenceVerif_User.GetFirstOrDefault(i => i.Id == Guid.Parse(id));

            _user = new User()
            {
                Id = _user.Id,
                //UserName = _user.UserName,
                //UserName = _user.Staff.FirstName + " " + _user.Staff.LastName,
                FullName = _user.FullName
            };
            return _user;
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpGet("api/qs/rv/get-references/")]
        public IEnumerable<Verifications> GetAllRefs(string id)
        {
            return _uow.ReferenceVerif_Verification.GetAll(a => a.Active);
        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpPost("api/qs/rv/post-ref")]
        public bool PostReference([FromBody] Verifications verification)
        {
            //Live
            //Out of life
            //var _status = _uow.ReferenceVerif_Verification.GetAll(i => (i.CustomerReference == verification.CustomerReference && i.CompanyId==verification.CompanyId)).Count();

            //verification.CustomerDefinitions=_uow.ReferenceVerif_CustomerDefinitions.GetFirstOrDefault(i=>i.Id==verification.CustomerDefinitionsId, includeProperties: "Company,Customer.Company");
            var _status = _uow.ReferenceVerif_Verification.GetAll(i => (i.CompanyReference == verification.CompanyReference)).Count();
            if (_status > 0)
                return false;
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
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpGet("api/qs/rv/get-logscanner")]
        public IEnumerable<Scanner_LOG> PostLogScanner()
        {
            return _uow.ReferenceVerif_Scanner_LOG.GetAll().OrderByDescending(i=>i.Id).Take(100);

        }
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.ProjectResponsible)]
        [HttpGet("api/qs/rv/get-loginput")]
        public IEnumerable<Input_LOG> PostLogInput()
        {
            return _uow.ReferenceVerif_Input_LOG.GetAll().OrderByDescending(i => i.Id).Take(100);
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
