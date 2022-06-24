﻿using Microsoft.AspNetCore.Authorization;
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
            int x = 0;
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
                    .Where(a => a.Active).OrderBy(i => i.IdNumber).ToList();
                foreach (var item in identificationIndex.Identification_Enumerable)
                {
                    var _sumTRY = _uow.Accounting_PurchaseInvoice.GetAll(i => i.IdentificationId == item.Id).Where(f=>f.ExchangeRateId==1).Sum(s=>s.TotalAmount);
                    var _sumUSD = _uow.Accounting_PurchaseInvoice.GetAll(i => i.IdentificationId == item.Id).Where(f=>f.ExchangeRateId==2).Sum(s=>s.TotalAmount);
                    var _sumEUR = _uow.Accounting_PurchaseInvoice.GetAll(i => i.IdentificationId == item.Id).Where(f=>f.ExchangeRateId==3).Sum(s=>s.TotalAmount);
                    identificationIndex.Identification_Enumerable[x].Balance_TRY = _sumTRY;
                    identificationIndex.Identification_Enumerable[x].Balance_USD = _sumUSD;
                    identificationIndex.Identification_Enumerable[x].Balance_EUR = _sumEUR;
                    x++;
                }
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
        [Route("accounting/ids/{compid}/edit-def/{id}")]
        public IActionResult EditDefinition(string compid, string id)
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
                identificationIndex.Identification_Enumerable = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank").ToList();
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
        [HttpGet("accounting/ids/{compid}/remove-def/{id}")]
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
            if (Ids.Term15)
                Ids.PaymentTerm = 15;
            else if (Ids.Term30)
                Ids.PaymentTerm = 30;
            else if (Ids.Term45)
                Ids.PaymentTerm = 45;
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
                Active = true
            };
            _uow.Accounting_Identification.Add(_identification);
            if (Ids.ContactEnumerable != null)
            {
                foreach (var item in Ids.ContactEnumerable)
                {
                    var _cont = new Contact()
                    {
                        IdentificationId = _identification.Id,
                        DepartmantId = item.DepartmantId,
                        Email = item.Email,
                        FullName = item.FullName,
                        MobileNumber = item.MobileNumber
                    };
                    _uow.Accounting_Contact.Add(_cont);
                }
            }

            _uow.Save();
            //return NoContent();
            return Redirect("/accounting/ids/" + Ids.CompanyId);
        }
        #endregion ACTION



        #region API
        [HttpPost("api/edit-def")]
        public string EditDefApi([FromBody] Identification identification)
        {
            try
            {
                var deg = identification;
                return "success";
            }
            catch (Exception ex)
            {
                return ex.InnerException.Message;
            }

        }
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
        public Category SetCategory([FromBody] Category cat)
        {
            cat.Company = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == cat.CompanyId);
            var _category = new Category() { Name = cat.Name, CompanyId = cat.CompanyId, Active = true };
            _uow.Accounting_Category.Add(_category);
            _uow.Save();

            return _category;
        }
        [HttpPost("api/accounting/add-tagdef")]
        public TagDefinitions AddTagDef([FromBody] TagDefinitions _tagdef)
        {
            _uow.Accounting_TagDefinations.Add(_tagdef);
            var status = _uow.Accounting_TagDefinations.GetFirstOrDefault(i => (i.TagId == _tagdef.TagId && i.SubCategoryId == _tagdef.SubCategoryId && i.CategoryId == _tagdef.CategoryId));
            if (status == null)
                _uow.Save();
            return _tagdef;
        }
        [Route("api/accounting/getCat/{id}")]
        public IEnumerable<Category> GetCategories(string id)
        {
            return _uow.Accounting_Category.GetAll().Where(i => (i.Active && i.CompanyId == Guid.Parse(id)));
        }

        [HttpPost("api/accounting/setSubCat")]
        public bool SetSubCat([FromBody] SubCategory sub)
        {
            var _substate = _uow.Accounting_Subcategory.GetFirstOrDefault(n => n.Name == sub.Name);
            //jqUERYDE HTML table listesine göre kontrol sağlanmalı!
            /*
            if (_substate == null)
            {
                _uow.Accounting_Subcategory.Add(sub);
                _uow.Save();
            }
            else
                return false;*/
            _uow.Accounting_Subcategory.Add(sub);
            _uow.Save();
            return true;
        }
        [Route("api/accounting/getsubcat/{id}")]
        public IEnumerable<SubCategory> GetSubcat(string id)
        {
            return _uow.Accounting_Subcategory.GetAll(i => i.CategoryId == Guid.Parse(id));
        }
        [HttpPost("api/accounting/setTag")]
        public bool SetTag([FromBody] Tag tag)
        {
            List<TagDefinitions> _tagDefinitions = new List<TagDefinitions>();
            if (String.IsNullOrEmpty(tag.Name) || string.IsNullOrWhiteSpace(tag.Name))
            {
                return true;
            }
            var _tag = _uow.Accounting_Tag.GetAll(includeProperties: "Category").Where(n => (n.Name == tag.Name && n.CategoryId == tag.CategoryId));
            if (tag.AddAll)
            {
                if (_tag.Count() > 0)
                {

                    var _subcats = _uow.Accounting_Subcategory.GetAll(i => i.CategoryId == tag.CategoryId);
                    foreach (var item in _subcats)
                    {

                        var _tagDef = new TagDefinitions()
                        {
                            TagId = _tag.FirstOrDefault().Id,
                            CategoryId = tag.CategoryId,
                            SubCategoryId = item.Id
                        };
                        var _tagDefcheck = _uow.Accounting_TagDefinations.GetFirstOrDefault(i => i.SubCategoryId == item.Id);
                        if (_tagDefcheck == null)
                        {
                            _tagDefinitions.Add(_tagDef);

                        }
                    }
                    if (_tagDefinitions.Count() > 0)
                    {
                        _uow.Accounting_TagDefinations.AddRange(_tagDefinitions);
                        _uow.Save();
                    }


                    return true;
                }
                else
                {
                    _uow.Accounting_Tag.Add(tag);
                    _uow.Save();

                    var _subcats = _uow.Accounting_Subcategory.GetAll(i => i.CategoryId == tag.CategoryId);
                    foreach (var item in _subcats)
                    {

                        var _tagDef = new TagDefinitions()
                        {
                            TagId = tag.Id,
                            CategoryId = tag.CategoryId,
                            SubCategoryId = item.Id
                        };
                        var _tagDefcheck = _uow.Accounting_TagDefinations.GetFirstOrDefault(i => (i.SubCategoryId == item.Id && i.TagId == tag.Id));
                        if (_tagDefcheck == null)
                        {
                            _tagDefinitions.Add(_tagDef);

                        }
                    }
                    if (_tagDefinitions.Count() > 0)
                    {
                        _uow.Accounting_TagDefinations.AddRange(_tagDefinitions);
                        _uow.Save();
                    }


                    return true;
                }



            }
            else
            {
                if (_tag.Count() > 0)
                    return false;
                else
                {

                    _uow.Accounting_Tag.Add(tag);
                    var _tagDef = new TagDefinitions()
                    {
                        TagId = tag.Id,
                        CategoryId = tag.CategoryId,
                        SubCategoryId = Guid.Parse(tag.SubCategoryId)
                    };
                    _uow.Accounting_TagDefinations.Add(_tagDef);
                    _uow.Save();

                }
            }

            return true;
        }

        [Route("api/accounting/gettags/{id}")]
        public IEnumerable<Tag> GetTags(string id)
        {
            List<Tag> _tags = new List<Tag>();
            var tagdefs = _uow.Accounting_TagDefinations.GetAll(i => i.SubCategoryId == Guid.Parse(id), includeProperties: "Tag,SubCategory");
            foreach (var item in tagdefs)
            {

                var _tagItem = new Tag()
                {
                    Id = item.Id,
                    SubCategoryId = item.Tag.SubCategoryId,
                    Active = item.Tag.Active,
                    CategoryId = item.Tag.CategoryId,
                    Name = item.Tag.Name
                    
                };
                _tags.Add(_tagItem);
            }
            return _tags.OrderBy(i => i.Name);
            //return null;
        }
        [Route("api/accounting/gettagsfromCat/{id}")]
        public IEnumerable<Tag> GetTagsFromCategory(string id)
        {
            List<Tag> _tags = new List<Tag>();
            var tagdefs = _uow.Accounting_Tag.GetAll(i => i.CategoryId == Guid.Parse(id), includeProperties: "Category");
            /*
            foreach (var item in tagdefs)
            {
                _tags.Add(item);
            }*/
            return tagdefs;
            //return null;
        }
        [HttpGet("api/accounting/getDef/{id}")]
        public IdentificationIndexVM GetDefinition(string id)
        {
            IdentificationIndexVM identificationIndex = new IdentificationIndexVM();

            /*
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
            }*/
            //identificationIndex.Identification_Enumerable = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank");
            identificationIndex.Identification_Item = _uow.Accounting_Identification.GetFirstOrDefault(i => i.Id == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank");

            /*
            if (identificationIndex.Identification_Item == null)
                return Content("OPUS SYSTEM - Definition was not found from this id='" + id + "'");
            */
            identificationIndex.ContactEnumerable = (List<Contact>)_uow.Accounting_Contact.GetAll(i => i.IdentificationId == Guid.Parse(id), includeProperties: "Departmant,Identification");



            return identificationIndex;

            //return _uow.Accounting_Identification.GetFirstOrDefault(i => i.Id == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank");
        }
        [HttpGet("api/accounting/remove-tag/{id}")]
        public bool RemoveTag(string id)
        {
            var _tagdef_remItem = _uow.Accounting_TagDefinations.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
            var tagTitle = _uow.Accounting_Tag.GetFirstOrDefault(i => i.Id == _tagdef_remItem.TagId);
            var _tagDefCount = _uow.Accounting_TagDefinations.GetAll(i => i.TagId == _tagdef_remItem.TagId).Count();

            if (_tagDefCount == 1)
            {
                _uow.Accounting_Tag.Remove(tagTitle);
                _uow.Accounting_TagDefinations.Remove(_tagdef_remItem);
            }
            else
                _uow.Accounting_TagDefinations.Remove(_tagdef_remItem);
            _uow.Save();


            return true;
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
        [HttpPost("api/accounting/add-staff")]
        public bool AddStaff([FromBody] Models.DbModels.Accounting.Staff _staff)
        {
            try
            {
                if (
                    _staff.DepartmantId == Guid.Parse("00000000-0000-0000-0000-000000000000") || _staff.CompanyId == Guid.Parse("00000000-0000-0000-0000-000000000000") ||
                    String.IsNullOrEmpty(_staff.FirstName) || String.IsNullOrWhiteSpace(_staff.FirstName) || String.IsNullOrEmpty(_staff.LastName) || String.IsNullOrWhiteSpace(_staff.LastName) ||
                    String.IsNullOrEmpty(_staff.Email) || String.IsNullOrWhiteSpace(_staff.Email) || String.IsNullOrEmpty(_staff.MobileNum) || String.IsNullOrWhiteSpace(_staff.MobileNum)
                    )
                    return false;
                else
                {
                    var split = _staff.MobileNum.Split('_').Count();
                    if (split > 1)
                    {
                        return false;
                    }
                    else
                    {
                        _uow.Accounting_Staff.Add(_staff);
                        _uow.Save();
                        return true;
                    }

                }
            }
            catch (Exception ex)
            {

                return false;
            }


        }
        [HttpGet("api/accounting/remove-staff/{id}")]
        public bool RemoveStaff(string id)
        {
            try
            {
                _uow.Accounting_Staff.Remove(_uow.Accounting_Staff.GetFirstOrDefault(i => i.Id == Guid.Parse(id)));
                _uow.Save();
            }
            catch (Exception ex)
            {
                return false;
            }

            return true;
        }
        [HttpGet("api/accounting/get-staff/{id}")]
        public IEnumerable<Models.DbModels.Accounting.Staff> GetStaffs(string id)
        {

            return _uow.Accounting_Staff.GetAll(includeProperties: "Departmant").Where(i => (i.CompanyId == Guid.Parse(id) && i.Active));
        }
        [HttpGet("api/accounting/calculateDatebyday/{day}/{docDate}")]
        public string CalculateDatebyDay(int day,string docDate)
        {
            try
            {
                return DateTime.Parse(docDate).AddDays(day).ToString("yyyy-MM-dd");
            }
            catch (Exception)
            {

                return null;
            }

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
