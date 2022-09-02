using Microsoft.AspNetCore.Mvc;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class TrainingController : Controller
    {
        [Route("training")]
        public IActionResult Index()
        {
            return View();
        }
        [Route("training/add")]
        public IActionResult Add()
        {
            return View();
        }
        [Route("training/add-trainer")]
        public IActionResult AddTrainer()
        {
            return View();
        }
    }
}
