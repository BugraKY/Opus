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
        public List<Category> SetCategory([FromBody] string name)
        {
            var categories = new List<Category>();

            var _cat1 = new Category() { Name = "Araba", Id = Guid.NewGuid() };
            var _cat2 = new Category() { Name = "Çanta", Id = Guid.NewGuid() };
            var _cat3 = new Category() { Name = "Masa", Id = Guid.NewGuid() };

            categories.Add(_cat1);
            categories.Add(_cat2);
            categories.Add(_cat3);

            var _category = new Category() { Name = name, Id = Guid.NewGuid(), Active = true };



            categories.Add(_category);
            return categories;
        }
        [Route("api/accounting/getCat")]
        public JsonResult GetCategories()// public List<Category> GetCategories()
        {
            var categories = new List<Category>();

            var _cat1 = new Category() { Name = "Araba", Id = Guid.NewGuid() };
            var _cat2 = new Category() { Name = "Çanta", Id = Guid.NewGuid() };
            var _cat3 = new Category() { Name = "Masa", Id = Guid.NewGuid() };

            categories.Add(_cat1);
            categories.Add(_cat2);
            categories.Add(_cat3);

            /*var _category = new Category() { Name = name, Id = Guid.NewGuid(), Active = true };



            categories.Add(_category);*/
            return Json(categories);
        }
        [HttpPost("api/accounting/getsubcat")]
        public string GetSubcat([FromBody] string name)
        {

            return name;
        }
        #endregion API

    }
}
