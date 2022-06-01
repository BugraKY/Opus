using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels.Accounting;
using Opus.Models.ViewModels.Accounting;
using static Opus.Utility.ProjectConstant;

namespace Opus.Areas.Accounting.Controllers
{
    [Area("Accounting")]
    [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Accounting)]
    public class IdentificationController : Controller
    {
        private readonly IUnitOfWork _uow;
        public IdentificationController(IUnitOfWork uow)
        {
            _uow = uow;
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
                identificationIndex.CommercialTitle_Enumerable = _uow.Accounting_Commercialtitle.GetAll();
                identificationIndex.Departmant_Enumerable = _uow.Accounting_Departmant.GetAll();
                if (identificationIndex.CompanyItem == null || identificationIndex.Companies.Count() == 0 ||
                    identificationIndex.IdentificationType_Enumerable.Count() == 0 || identificationIndex.Bank_Enumerable.Count() == 0 ||
                    identificationIndex.CommercialTitle_Enumerable.Count() == 0 || identificationIndex.Departmant_Enumerable.Count() == 0)
                {
                    return Redirect("/accounting/identifications");
                }
                identificationIndex.Identification_Enumerable = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,CommercialTitle,Company,Bank");

            }
            catch (Exception ex)
            {
                return Content(ex.InnerException.Message);
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
                identificationIndex.CommercialTitle_Enumerable = _uow.Accounting_Commercialtitle.GetAll();
                identificationIndex.Departmant_Enumerable = _uow.Accounting_Departmant.GetAll();
                if (identificationIndex.CompanyItem == null || !identificationIndex.Companies.Any() ||
                    !identificationIndex.IdentificationType_Enumerable.Any() || !identificationIndex.Bank_Enumerable.Any() ||
                    !identificationIndex.CommercialTitle_Enumerable.Any() || !identificationIndex.Departmant_Enumerable.Any())
                {
                    return Redirect("/accounting/identifications");
                }
                identificationIndex.Identification_Enumerable = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,CommercialTitle,Company,Bank");
                identificationIndex.Identification_Item = _uow.Accounting_Identification.GetFirstOrDefault(i => i.Id == Guid.Parse(id), includeProperties: "IdentificationType,CommercialTitle,Company,Bank");

                if (identificationIndex.Identification_Item == null)
                    return Content("OPUS SYSTEM - Definition was not found from this id='" + id + "'");

            }
            catch (Exception ex)
            {
                return Content(ex.InnerException.Message);
            }

            return View(identificationIndex);
        }
        [HttpGet("accounting/ids/{compid}/definition-remove/{id}")]
        public IActionResult RemoveDefinition(string id, string compid)
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

            return Redirect("/accounting/ids/" + compid);
        }
        [HttpPost("accounting/definitionpost")]
        public IActionResult DefinitionPost(IdentificationIndexVM Ids)
        {
            var _identification = new Identification()
            {
                BankId = Ids.BankId,
                CommercialTitleId = Ids.CommercialTitleId,
                IdentificationTypeId = Ids.IdentificationTypeId,
                CompanyId = Guid.Parse(Ids.CompanyId),
                IdentityCode = Ids.IdentityCode,
                IdNumber = Ids.IdNumber,
                IBAN = Ids.IBAN,
                StreetAddress = Ids.StreetAddress,
                TaxAuthority = Ids.TaxAuthority,
                TaxNo = Ids.TaxNo,
                PaymentTerm30 = Ids.PaymentTerm30,
                PaymentTerm60 = Ids.PaymentTerm60,
                PaymentTerm90 = Ids.PaymentTerm90
            };
            _uow.Accounting_Identification.Add(_identification);
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
            _uow.Accounting_Bank.AddAsync(_bank);
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
            var _def = _uow.Accounting_Identification.GetFirstOrDefault(i => i.Id == Guid.Parse(id), includeProperties: "IdentificationType,CommercialTitle,Company,Bank");
            return Json(_def);
        }
        [Route("api/accounting/getalldep")]
        public IEnumerable<Departmant> GetDepartmants()
        {
            return _uow.Accounting_Departmant.GetAll();
        }
        [Route("api/accounting/getallbank")]
        public IEnumerable<Bank> GetBanks()
        {
            return _uow.Accounting_Bank.GetAll();
        }
        #endregion API

    }
}
