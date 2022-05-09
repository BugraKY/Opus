using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;

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
    }
}
