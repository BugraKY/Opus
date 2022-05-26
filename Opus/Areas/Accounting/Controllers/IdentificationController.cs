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
        public string AddDepartmant([FromBody]string name)
        {
            var _departmant = new Departmant(){Name=name};
            _uow.Accounting_Departmant.Add(_departmant);
            return name;
        }

        [HttpPost("api/accounting/add-bank")]
        public string AddBank([FromBody] string name)
        {
            var _bank = new Bank() { Name=name};
            _uow.Accounting_Bank.Add(_bank);
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
        #endregion API

    }
}
