using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.DataAcces.MainRepository;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using Opus.Models.ViewModels.ReferenceVerif;
using Opus.Utility;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class TrainingController : Controller
    {
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IUnitOfWork _uow;
        public TrainingController(IWebHostEnvironment webHostEnvironment, IUnitOfWork uow)
        {
            _hostEnvironment = webHostEnvironment;
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
        public async Task<IActionResult> AddCompanyPost(Company company)
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
                var check = _uow.References.GetFirstOrDefault(i => (i.BarcodeNum == references.BarcodeNum || i.CompanyReference == references.CompanyReference));
                if (check == null)
                {
                    references.Active = true;
                    _uow.References.Add(references);
                    _uow.Save();
                }
                return RedirectToAction("AddReference");
            });
        }
        [HttpPost("training/add")]
        public async Task<IActionResult> AddPost(TrainingVM TrainingInput)
        {
            _uow.Training.Add(TrainingInput);
            var StaffTrainingEnumerable = new List<StaffTraining>();
            foreach (var item in TrainingInput.Enumerable_StaffTraining)
            {
                var StaffTrainingItem = new StaffTraining()
                {
                    Date = item.Date,
                    ReferencesId = item.ReferencesId,
                    StaffId = item.StaffId,
                    TrainerId = item.TrainerId,
                    TrainingId = TrainingInput.Id,
                };
                StaffTrainingEnumerable.Add(StaffTrainingItem);
            }
            _uow.StaffTraining.AddRange(StaffTrainingEnumerable);
            _uow.Save();
            string webRootPath = _hostEnvironment.WebRootPath;
            if (TrainingInput.FormFile != null)
            {
                CopyFileExtension copyFile = new CopyFileExtension(_uow);
                copyFile.Upload_TrainingDoc(TrainingInput.FormFile, TrainingInput.Id, webRootPath);
            }

            return NoContent();
            return await Task.Run(() =>
            {
                return RedirectToAction("Add");
            });
        }
        [Route("training/view/{id}")]
        public async Task<IActionResult> TrainingView(string id)
        {
            return await Task.Run(() =>
            {
                var _training = _uow.Training.GetFirstOrDefault(i => i.Id == Guid.Parse(id),includeProperties:"Location");

                var _trainingVM = new TrainingVM
                {
                    Id = _training.Id,
                    Subject = _training.Subject,
                    Description = _training.Description,
                    Location = _training.Location,
                    Enumerable_StaffTraining = _uow.StaffTraining.GetAll(i => i.TrainingId == _training.Id,includeProperties:"Staff,Trainer,References")
                };
                return View(_trainingVM);
            });
        }
    }
}
