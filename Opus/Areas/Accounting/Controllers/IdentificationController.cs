using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels.Accounting;
using Opus.Models.ViewModels.Accounting;

namespace Opus.Areas.Accounting.Controllers
{
    [Area("Accounting")]
    public class IdentificationController : Controller
    {
        private readonly IUnitOfWork _uow;
        public IdentificationController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("accounting/ids/{id}")]
        public IActionResult Index(string id)
        {
            IdentificationIndexVM identificationIndex = new IdentificationIndexVM();
            identificationIndex.CompanyItem = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
            identificationIndex.Companies = _uow.Accounting_Company.GetAll();

            // var _comp = _uow.Accounting_Company.GetFirstOrDefault(i=>i.Id==Guid.Parse(id));
            return View(identificationIndex);
        }
        [Route("accounting/identifications")]
        public IActionResult Identifications()
        {
            return View();
        }

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

        [HttpGet("api/accounting/getDefCode/{code}")]
        public JsonResult GetCode(string code)
        {
            if (code == null)
                return Json("null");
            if (code == "1")
                return Json("sup-001");
            if (code == "2")
                return Json("cus-001");
            return Json("unexpected Code");
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
            var tags = _uow.Accounting_Tag.GetAll(i => i.SubCategoryId == Guid.Parse(id),includeProperties:"Category,SubCategory");
            return tags;
        }
        #endregion API

    }
}
