using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGeneration.EntityFrameworkCore;
using Opus.DataAcces.IMainRepository;
using Opus.DataAcces.MainRepository;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using Opus.Models.ViewModels.ReferenceVerif;
using Opus.Utility;
using static Opus.Utility.ProjectConstant;

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
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
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
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
        public IActionResult Add()
        {
            return View();
        }
        [Route("training/add-trainer")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
        public IActionResult AddTrainer()
        {
            return View();
        }
        [Route("training/add-reference")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
        public IActionResult AddReference()
        {
            return View();
        }
        [Route("training/add-company")]
        [Authorize(Roles = UserRoles.Admin)]
        public IActionResult AddCompany()
        {
            return View();
        }
        [HttpPost("training/add-company")]
        [Authorize(Roles = UserRoles.Admin)]
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
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
        public async Task<IActionResult> AddReferencePost(References references)
        {
            return await Task.Run(() =>
            {
                var check = _uow.References.GetFirstOrDefault(i => i.Reference == references.Reference);
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
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
        public async Task<IActionResult> AddPost(TrainingVM TrainingInput)
        {

            if(TrainingInput.FormFile != null)
                TrainingInput.DocumentImgUrl = "training-form" + System.IO.Path.GetExtension(TrainingInput.FormFile.FileName);

            TrainingInput.Date = TrainingInput.Enumerable_StaffTraining.FirstOrDefault().Date;
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
            string webRootPath = _hostEnvironment.WebRootPath;

            if (TrainingInput.FormFile != null)
            {
                CopyFileExtension copyFile = new CopyFileExtension(_uow);
                copyFile.Upload_TrainingDoc(TrainingInput.FormFile, null, TrainingInput.Id, webRootPath);
            }
            _uow.StaffTraining.AddRange(StaffTrainingEnumerable);
            _uow.Save();


            //return NoContent();

            return await Task.Run(() =>
            {
                return RedirectToAction("Index");
            });
        }
        [Route("training/view/{id}")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
        public async Task<IActionResult> TrainingView(string id)
        {
            var _training = _uow.Training.GetFirstOrDefault(i => i.Id == Guid.Parse(id), includeProperties: "Location");
            if (_training == null)
                return Redirect("/training");
            else
            {
                return await Task.Run(() =>
                {

                    var _trainingVM = new TrainingVM
                    {
                        Id = _training.Id,
                        Subject = _training.Subject,
                        Description = _training.Description,
                        Location = _training.Location,
                        DocumentImgUrl = _training.DocumentImgUrl,
                        Enumerable_StaffTraining = _uow.StaffTraining.GetAll(i => i.TrainingId == _training.Id, includeProperties: "Staff,Trainer,References")
                    };
                    return View(_trainingVM);
                });
            }
        }
        [Route("training/edit/{id}")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
        public async Task<IActionResult> TrainingEdit(string id)
        {
            var _training = _uow.Training.GetFirstOrDefault(i => i.Id == Guid.Parse(id), includeProperties: "Location,References,Trainer");
            if (_training == null)
                return Redirect("/training");
            else
            {
                return await Task.Run(() =>
                {

                    var _trainingVM = new TrainingVM
                    {
                        Id = _training.Id,
                        Subject = _training.Subject,
                        Description = _training.Description,
                        Location = _training.Location,
                        References = _training.References,
                        ReferencesId = _training.ReferencesId,
                        Trainer = _training.Trainer,
                        TrainerId = _training.TrainerId,
                        DocumentImgUrl = _training.DocumentImgUrl,
                        Enumerable_StaffTraining = _uow.StaffTraining.GetAll(i => i.TrainingId == _training.Id, includeProperties: "Staff,Trainer,References")
                    };
                    return View(_trainingVM);
                });
            }
        }
        [HttpPost("training/edit/{id}")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
        public async Task<IActionResult> TrainingEditPost(TrainingVM TrainingInput)
        {
            var _currentTrainig = _uow.Training.GetFirstOrDefault(i => i.Id == TrainingInput.Id, includeProperties: "Location");
            TrainingInput.LocationId = _currentTrainig.LocationId;
            if (TrainingInput.FormFile == null)
            {
                if (TrainingInput.DocumentImgUrl == null)
                    TrainingInput.DocumentImgUrl = _currentTrainig.DocumentImgUrl;
            }
            else
                TrainingInput.DocumentImgUrl = "training-form" + System.IO.Path.GetExtension(TrainingInput.FormFile.FileName);

            int i = 0;
            foreach (var item in TrainingInput.Enumerable_StaffTraining)
            {
                item.TrainingId = TrainingInput.Id;
                if (item.Id == 0)
                {
                    _uow.StaffTraining.Add(item);
                }
                i++;
            }
            i = 0;
            if (TrainingInput.Enumerable_StaffTrainingIds != null)
            {
                foreach (var item in TrainingInput.Enumerable_StaffTrainingIds)
                {
                    var _removeStaffTraining = _uow.StaffTraining.GetFirstOrDefault(i => i.Id == item);
                    _uow.StaffTraining.Remove(_removeStaffTraining);
                    i++;
                }
            }
            //Training _trainig = TrainingInput;
            _uow.Training.Update((Training)TrainingInput);
            string webRootPath = _hostEnvironment.WebRootPath;

            if (TrainingInput.FormFile != null)
            {
                CopyFileExtension copyFile = new CopyFileExtension(_uow);
                copyFile.Upload_TrainingDoc(TrainingInput.FormFile, _currentTrainig.DocumentImgUrl, TrainingInput.Id, webRootPath);
            }
            _uow.Save();

            return Redirect("/training/edit/" + TrainingInput.Id);
            /*
            return await Task.Run(() =>
            {

                var _trainingVM = new TrainingVM
                {
                    Id = TrainingInput.Id,
                    Subject = TrainingInput.Subject,
                    Description = TrainingInput.Description,
                    Location = TrainingInput.Location,
                    DocumentImgUrl = TrainingInput.DocumentImgUrl,
                    Enumerable_StaffTraining = _uow.StaffTraining.GetAll(i => i.TrainingId == TrainingInput.Id, includeProperties: "Staff,Trainer,References")
                };
                return Redirect("/training/edit/" + _trainingVM.Id);
            });
            */
        }
        [HttpGet("training/changeref-state/{RefId}")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
        public IActionResult ReferenceChangeState(string RefId)
        {
            var _ref = _uow.References.GetFirstOrDefault(i => i.Id == Guid.Parse(RefId));
            if (_ref.Active)
                _ref.Active = false;
            else
                _ref.Active = true;
            _uow.References.Update(_ref);
            _uow.Save();
            return NoContent();
        }
        [Route("training/{route}")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible + "," + UserRoles.TrainingRegistrationResp)]
        public async Task<IActionResult> NonRoute(string route)
        {
            return await Task.Run(() => { return Redirect("/training"); });
        }
    }
}
