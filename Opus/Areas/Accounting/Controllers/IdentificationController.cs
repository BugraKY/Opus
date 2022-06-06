using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using Opus.Models.DbModels.Accounting;
using Opus.Models.ViewModels.Accounting;
using System.Security.Claims;
using static Opus.Utility.ProjectConstant;

namespace Opus.Areas.Accounting.Controllers
{
    [Area("Accounting")]
    [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Accounting)]
    public class IdentificationController : Controller
    {
        private readonly IUnitOfWork _uow;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        public IdentificationController(IUnitOfWork uow, RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _uow = uow;
            _userManager = userManager;
            _roleManager = roleManager;
        }
        #region ACTION
        [Route("accounting/ids/{id}")]
        public IActionResult Index(string id)
        {
            IdentificationIndexVM identificationIndex = new IdentificationIndexVM();
            try
            {
                identificationIndex.CompanyItem = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
                identificationIndex.Companies = _uow.Accounting_Company.GetAll();
                identificationIndex.IdentificationType_Enumerable = _uow.Accounting_Identificationtype.GetAll();
                identificationIndex.Bank_Enumerable = _uow.Accounting_Bank.GetAll();
                identificationIndex.Departmant_Enumerable = _uow.Accounting_Departmant.GetAll();
                if (identificationIndex.CompanyItem == null || identificationIndex.Companies.Count() == 0 ||
                    identificationIndex.IdentificationType_Enumerable.Count() == 0 || identificationIndex.Bank_Enumerable.Count() == 0 ||
                    identificationIndex.Departmant_Enumerable.Count() == 0)
                {
                    return Redirect("/accounting/identifications");
                }
                identificationIndex.Identification_Enumerable = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank")
                    .Where(a=>a.Active).OrderBy(i=>i.IdNumber);
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                    return Content(ex.InnerException.Message);
                else
                    return Content(ex.Message);
            }

            return View(identificationIndex);
        }
        [Route("accounting/identifications")]
        public IActionResult Identifications()
        {
            IdentificationIndexVM identificationIndex = new IdentificationIndexVM();
            identificationIndex.Departmant_Enumerable = _uow.Accounting_Departmant.GetAll().OrderBy(n => n.Name);
            identificationIndex.Bank_Enumerable = _uow.Accounting_Bank.GetAll().OrderBy(n => n.Name);
            return View(identificationIndex);
        }
        [Route("accounting/edit-def/{id}/comp-id/{compid}")]
        public IActionResult EditDefinition(string id, string compid)
        {
            IdentificationIndexVM identificationIndex = new IdentificationIndexVM();
            try
            {
                identificationIndex.CompanyItem = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == Guid.Parse(compid));
                identificationIndex.Companies = _uow.Accounting_Company.GetAll();
                identificationIndex.IdentificationType_Enumerable = _uow.Accounting_Identificationtype.GetAll();
                identificationIndex.Bank_Enumerable = _uow.Accounting_Bank.GetAll();
                identificationIndex.Departmant_Enumerable = _uow.Accounting_Departmant.GetAll();
                if (identificationIndex.CompanyItem == null || !identificationIndex.Companies.Any() ||
                    !identificationIndex.IdentificationType_Enumerable.Any() || !identificationIndex.Bank_Enumerable.Any() ||
                    !identificationIndex.Departmant_Enumerable.Any())
                {
                    return Redirect("/accounting/identifications");
                }
                identificationIndex.Identification_Enumerable = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank");
                identificationIndex.Identification_Item = _uow.Accounting_Identification.GetFirstOrDefault(i => i.Id == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank");

                if (identificationIndex.Identification_Item == null)
                    return Content("OPUS SYSTEM - Definition was not found from this id='" + id + "'");

            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                    return Content(ex.InnerException.Message);
                else
                    return Content(ex.Message);
            }

            return View(identificationIndex);
        }
        [HttpGet("accounting/ids/{compid}/definition-remove/{id}")]
        public async Task<IActionResult> RemoveDefinition(string id, string compid)
        {
            #region CheckAuth
            var user = await _userManager.GetUsersInRoleAsync(UserRoles.Admin);
            var _claim = user.FirstOrDefault(i => i.Id == AppUser().Id);
            #endregion CheckAuth

            if (_claim != null)
            {
                try
                {
                    var _definition = _uow.Accounting_Identification.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
                    if (_definition == null)
                        return Content("OPUS SYSTEM - Definition was not found from this id='" + id + "'");
                    else
                    {
                        _uow.Accounting_Identification.Remove(_definition);
                        _uow.Save();
                    }
                }
                catch (Exception ex)
                {
                    return Content(ex.InnerException.Message.ToString());
                }
            }
            else
                return Content("OPUS SYSTEM - You are not authorized to remove.");


            return Redirect("/accounting/ids/" + compid);
        }
        [HttpPost("accounting/definitionpost")]
        public IActionResult DefinitionPost(IdentificationIndexVM Ids)
        {
            if (Ids.Term30)
                Ids.PaymentTerm = 30;
            else if (Ids.Term60)
                Ids.PaymentTerm = 60;
            else if (Ids.Term90)
                Ids.PaymentTerm = 90;
            else
                Ids.PaymentTerm = 30;

            var _identification = new Identification()
            {
                BankId = Ids.BankId,
                CommercialTitle = Ids.CommercialTitle,
                IdentificationTypeId = Ids.IdentificationTypeId,
                CompanyId = Guid.Parse(Ids.CompanyId),
                IdentityCode = Ids.IdentityCode,
                IdNumber = Ids.IdNumber,
                IBAN = Ids.IBAN,
                StreetAddress = Ids.StreetAddress,
                TaxAuthority = Ids.TaxAuthority,
                TaxNo = Ids.TaxNo,
                PaymentTerm = Ids.PaymentTerm,
                Active=true
            };
            _uow.Accounting_Identification.Add(_identification);
            if (Ids.ContactEnumerable != null)
                _uow.Accounting_Contact.AddRange(Ids.ContactEnumerable);
            _uow.Save();
            //return NoContent();
            return Redirect("/accounting/ids/" + Ids.CompanyId);
        }
        #endregion ACTION


        #region API
        [HttpPost("api/accounting/add-dep")]
        public string AddDepartmant([FromBody] string name)
        {
            var _departmant = new Departmant() { Name = name };
            _uow.Accounting_Departmant.Add(_departmant);
            _uow.Save();
            return name;
        }

        [HttpPost("api/accounting/add-bank")]
        public string AddBank([FromBody] string name)
        {
            var _bank = new Bank() { Name = name };
            _uow.Accounting_Bank.Add(_bank);
            _uow.Save();
            return name;
        }

        [HttpGet("api/accounting/getDefCode/{defCode}/compCode/{compCode}")]
        public JsonResult GetCode(string defCode, string compCode)
        {
            var def = _uow.Accounting_Identificationtype.GetFirstOrDefault(x => x.Id == Guid.Parse(defCode)).Identity;

            long checkCode = 0;

            if (_uow.Accounting_Identification.GetAll().OrderByDescending(i => i.IdentityCode).FirstOrDefault() != null)
                checkCode = (_uow.Accounting_Identification.GetAll().OrderByDescending(i => i.IdNumber).FirstOrDefault().IdNumber + 1);
            else
                checkCode = 1;


            var checkCodeSTR = "";

            for (int i = 4; checkCode.ToString().Length < i; i--)
            {
                checkCodeSTR += "0";
            }
            checkCodeSTR += checkCode.ToString();

            var GeneratedCode = def + "-" + checkCodeSTR;

            var _identification = new Identification()
            {
                IdNumber = checkCode,
                IdentityCode = GeneratedCode
            };

            if (defCode == null || compCode == null)
                return Json("unexpected Code");
            else
                return Json(_identification);
        }
        [HttpPost("api/accounting/setCat")]
        public Category SetCategory([FromBody] string name)
        {
            var _category = new Category() { Name = name, Active = true };
            _uow.Accounting_Category.Add(_category);
            _uow.Save();

            return _category;
        }
        [Route("api/accounting/getCat")]
        public IEnumerable<Category> GetCategories()
        {
            return _uow.Accounting_Category.GetAll().Where(i => i.Active);
        }

        [HttpPost("api/accounting/setSubCat")]
        public bool SetSubCat([FromBody] SubCategory sub)
        {
            var _substate = _uow.Accounting_Subcategory.GetFirstOrDefault(n => n.Name == sub.Name);
            if (_substate == null)
            {
                _uow.Accounting_Subcategory.Add(sub);
                _uow.Save();
            }
            else
                return false;
            return true;
        }
        [Route("api/accounting/getsubcat/{id}")]
        public IEnumerable<SubCategory> GetSubcat(string id)
        {
            //Thread.Sleep(1000);
            //var test= _uow.Accounting_Subcategory.GetAll(i => i.CategoryId == id, includeProperties: "Category");
            var subs = _uow.Accounting_Subcategory.GetAll(i => i.CategoryId == Guid.Parse(id));
            return subs;
        }
        [HttpPost("api/accounting/setTag")]
        public bool SetTag([FromBody] Tag tag)
        {
            var _tag = _uow.Accounting_Tag.GetFirstOrDefault(n => n.Name == tag.Name);
            if (_tag == null)
            {
                _uow.Accounting_Tag.Add(tag);
                _uow.Save();
            }
            else
                return false;
            return true;
        }
        [Route("api/accounting/gettags/{id}")]
        public IEnumerable<Tag> GetTags(string id)
        {
            var tags = _uow.Accounting_Tag.GetAll(i => i.SubCategoryId == Guid.Parse(id), includeProperties: "Category,SubCategory");
            return tags;
        }
        [HttpGet("api/accounting/getDef/{id}")]
        public JsonResult GetDefinition(string id)
        {
            var _def = _uow.Accounting_Identification.GetFirstOrDefault(i => i.Id == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank");
            return Json(_def);
        }
        [Route("api/accounting/getalldep")]
        public IEnumerable<Departmant> GetDepartmants()
        {
            return _uow.Accounting_Departmant.GetAll().OrderBy(n => n.Name);
        }
        [Route("api/accounting/getallbank")]
        public IEnumerable<Bank> GetBanks()
        {
            return _uow.Accounting_Bank.GetAll().OrderBy(n => n.Name);
        }
        #endregion API

        #region Extensions
        public ApplicationUser AppUser()
        {
            return _uow.ApplicationUser.GetFirstOrDefault(i => i.Id == GetClaim().Value);
        }
        public Claim GetClaim()
        {
            var claimsIdentity = (ClaimsIdentity)User.Identity;
            var Claims = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier);
            if (Claims != null)
                return Claims;
            return null;
        }
        #endregion Extensions

    }
}
