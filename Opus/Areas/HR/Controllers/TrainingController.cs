using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.DataAcces.MainRepository;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using Opus.Models.ViewModels.ReferenceVerif;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class TrainingController : Controller
    {
        private readonly IUnitOfWork _uow;
        public TrainingController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("training")]
        public IActionResult Index()
        {/*
            var _models = new AllModelsVM()
            {
                Companies = _uow.ReferenceVerif_Company.GetAll(a => a.Active).OrderBy(N => N.Name),
                Customers = _uow.ReferenceVerif_Customer.GetAll(a => a.Active, includeProperties: "Company").OrderBy(N => N.Company.Name)
            };*/

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
        [Route("training/add-reference")]
        public IActionResult AddReference()
        {
            return View();
        }
        [Route("training/add-company")]
        public IActionResult AddCompany()
        {
            return View();
        }
        [HttpPost("training/add-company")]
        public async Task<IActionResult> AddReferencePost(Company company)
        {
            return await Task.Run(() =>
            {
                _uow.Company.Add(company);
                _uow.Save();
                return RedirectToAction("AddCompany");
            });
        }
        [HttpPost("training/add-reference")]
        public async Task<IActionResult> AddReferencePost(References references)
        {
            return await Task.Run(() =>
            {

                return RedirectToAction("Add");
            });
        }
        [HttpPost("training/add")]
        public async Task<IActionResult> AddPost(TrainingVM TrainingInput)
        {
            return await Task.Run(() =>
            {

                return RedirectToAction("Add");
            });
        }
    }
}
