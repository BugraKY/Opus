using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.DataAcces.MainRepository;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class LocationController : Controller
    {
        private readonly IUnitOfWork _uow;
        public LocationController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("locations")]
        public IActionResult Index()
        {
            return View(_uow.Location.GetAll());
        }
    }
}
