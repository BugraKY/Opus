using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;

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
            var _comp = _uow.Accounting_Company.GetFirstOrDefault(i=>i.Id==Guid.Parse(id));
            return View(_comp);
        }
    }
}
