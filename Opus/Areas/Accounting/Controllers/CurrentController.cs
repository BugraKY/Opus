using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels.Accounting;

namespace Opus.Areas.Accounting.Controllers
{
    [Area("Accounting")]
    public class CurrentController : Controller
    {
        private readonly IUnitOfWork _uow;
        public CurrentController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("accounting/curr")]
        public IActionResult Index()
        {
            var comps=_uow.Accounting_Company.GetAll().OrderBy(s=>s.Sorting);
            return View(comps);
        }
        [Route("accounting/curr/{id}")]
        public IActionResult SelectFunc(string id)
        {

            return View(id);
                
        }
        [HttpGet("api/accounting/get-comps")]
        public IEnumerable<Company> Companies()
        {
            List<Company> companies = new List<Company>();
            var _comps = _uow.Accounting_Company.GetAll();
            foreach (var item in _comps)
            {
                var companyItem = new Company()
                {
                    Id = item.Id,
                    Name = item.Name
                };
                companies.Add(companyItem);
            }
            return companies;
        }
    }
}
