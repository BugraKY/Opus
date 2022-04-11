using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using Opus.Utility;
using System.Security.Claims;
using static Opus.Utility.Enums;
using static Opus.Utility.ProjectConstant;

namespace Opus.Controllers
{
    //[Authorize]
    public class StaffController : Controller
    {
        private readonly IUnitOfWork _uow;
        private readonly IWebHostEnvironment _hostEnvironment;
        public StaffController(IUnitOfWork uow, IWebHostEnvironment hostEnvironment)
        {
            _uow = uow;
            _hostEnvironment = hostEnvironment;
        }
        [Route("staff")]
        public IActionResult Index()
        {
            #region Authentication
            if (GetClaim() != null)
            {
                var staffs = _uow.Staff.GetAll();
                return View(staffs);
            }
            return NotFound();
            #endregion Authentication
        }
        [Route("staff/add")]
        public IActionResult Add()
        {
            #region Authentication
            if (GetClaim() != null)
            {
                var _products = _uow.Products.GetAll();
                var staffVM = new StaffVM()
                {
                    Products = _products.ToList()
                };
                return View(staffVM);
            }
            return NotFound();
            #endregion Authentication
        }
        [HttpGet("staff/edit/{id}")]
        public IActionResult Edit(Guid id)
        {
            var _staff = _uow.Staff.GetFirstOrDefault(x => x.Guid == id);
            var _familyMembers = _uow.FamilyMembers.GetAll(x => x.StaffId == id.ToString(), includeProperties: "FamilyRelationship");
            var _staffEquipments = _uow.StaffEquipment.GetAll(x => x.StaffId == _staff.Id);
            var _products = _uow.Products.GetAll();
            var staffVM = new StaffVM()
            {
                Active = _staff.Active,
                IBAN = _staff.IBAN,
                StreetAddress = _staff.StreetAddress,
                TestD2_TNE = _staff.TestD2_TNE,
                TestD2_E = _staff.TestD2_E,
                BirthPlace = _staff.BirthPlace,
                BlackList = _staff.BlackList,
                BloodTypeId = _staff.BloodTypeId,
                CountryId = _staff.CountryId,
                CurrentSalary = _staff.CurrentSalary,
                DateOfBirth = _staff.DateOfBirth,
                DateOfEntry = _staff.DateOfEntry,
                DateOfQuit = _staff.DateOfQuit,
                Degree = _staff.Degree,
                EducationalStatus = _staff.EducationalStatus,
                FatherName = _staff.FatherName,
                FirstName = _staff.FirstName,
                LastName = _staff.LastName,
                IdentityNumber = _staff.IdentityNumber,
                ImageFile = _staff.ImageFile,
                MaritalStatus = _staff.MaritalStatus,
                MobileNumber = _staff.MobileNumber,
                MotherName = _staff.MotherName,
                NumberOfChildren = _staff.NumberOfChildren,
                PhoneNumber = _staff.PhoneNumber,
                PhoneNumberSec = _staff.PhoneNumberSec,
                RegistrationNumber = _staff.RegistrationNumber,
                Status = _staff.Status,
                WhiteCollarWorker = _staff.WhiteCollarWorker,
                FamilyMembersEnumerable = _familyMembers,
                StaffEquipmentEnumerable = _staffEquipments,
                Products = _products,
                Guid = _staff.Guid,

            };
            return View(staffVM);
        }
        [HttpGet("staff/card/{id}")]
        public IActionResult Card()
        {
            return View();
        }
        [HttpPost("staff/edit/{id}")]
        public IActionResult Upsert(int id)
        {
            return View();
        }
        [HttpPost("staff/add")]
        public async Task<IActionResult> AddAsync(StaffVM staffVm)
        {

            //var files = staffVm.Files;
            string webRootPath = _hostEnvironment.WebRootPath;

            IList<Products> _products = new List<Products>();
            List<StaffEquipment> _staffEquipments = new List<StaffEquipment>();
            List<FamilyMembers> _familyMembers = new List<FamilyMembers>();

            var _staff = new Staff()
            {
                Active = staffVm.Active,
                IBAN = staffVm.IBAN,
                StreetAddress = staffVm.StreetAddress,
                TestD2_TNE = staffVm.TestD2_TNE,
                TestD2_E = staffVm.TestD2_E,
                BirthPlace = staffVm.BirthPlace,
                BlackList = staffVm.BlackList,
                BloodTypeId = staffVm.BloodTypeId,
                CountryId = staffVm.CountryId,
                CurrentSalary = staffVm.CurrentSalary,
                DateOfBirth = staffVm.DateOfBirth,
                DateOfEntry = staffVm.DateOfEntry,
                DateOfQuit = staffVm.DateOfQuit,
                Degree = staffVm.Degree,
                EducationalStatus = staffVm.EducationalStatus,
                FatherName = staffVm.FatherName,
                FirstName = staffVm.FirstName,
                LastName = staffVm.LastName,
                IdentityNumber = staffVm.IdentityNumber,
                ImageFile = staffVm.Files.ImageFile.FileName,
                MaritalStatus = staffVm.MaritalStatus,
                MobileNumber = staffVm.MobileNumber,
                MotherName = staffVm.MotherName,
                NumberOfChildren = staffVm.NumberOfChildren,
                PhoneNumber = staffVm.PhoneNumber,
                PhoneNumberSec = staffVm.PhoneNumberSec,
                RegistrationNumber = staffVm.RegistrationNumber,
                Status = staffVm.Status,
                WhiteCollarWorker = staffVm.WhiteCollarWorker,
                Guid = Guid.NewGuid()
            };

            _uow.Staff.Add(_staff);
            _uow.Save();
            var staffId = _staff.Id;
            int i = 0;


            if (staffVm.StaffEquipmentEnumerable != null)
            {
                foreach (var item in staffVm.StaffEquipmentEnumerable)
                {
                    var _staffEquipment = new StaffEquipment()
                    {
                        DeliveryDate = item.DeliveryDate,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        ReturnDate = item.ReturnDate,
                        StaffId = staffId
                    };
                    _uow.StaffEquipment.Add(_staffEquipment);
                }
                _uow.Save();
                i = 0;
            }
            if (staffVm.FamilyMembers.FamilyRelationshipId.Count() > 0)
            {
                foreach (var item in staffVm.FamilyMembers.IdentityNumber)
                {
                    var _familyMember = new FamilyMembers()
                    {
                        BirthPlace = staffVm.FamilyMembers.BirthPlace[i],
                        DateOfBirth = DateTime.Parse(staffVm.FamilyMembers.DateOfBirth[i]),
                        FamilyRelationshipId = staffVm.FamilyMembers.FamilyRelationshipId[i],
                        FullName = staffVm.FamilyMembers.FullName[i],
                        IdentityNumber = item,
                        StaffId = staffId.ToString()
                    };
                    _uow.FamilyMembers.Add(_familyMember);

                    i++;
                }
                _uow.Save();
            }


            var _bloodtype = _uow.BloodType.GetFirstOrDefault(i => i.Id == staffVm.BloodTypeId);
            staffVm.BloodType = _bloodtype;

            CopyFileExtension copyFile = new CopyFileExtension(_uow);
            copyFile.Upload(staffVm.Files, webRootPath, _staff.Guid, _staff.Id);

            //_uow.StaffEquipment.AddRange(_staffEquipments);
            //_uow.FamilyMembers.AddRange(_familyMembers);
            //_uow.FamilyMembers.AddRange();
            //_uow.Save();
            await Task.Delay(1);
            var StaffEquipment = staffVm.StaffEquipment;
            return NoContent();
            #region Authentication
            if (GetClaim() != null)
            {
                return View();//Go Dashboard
            }
            return NotFound();
            #endregion Authentication
        }
        #region API
        [HttpPost("api/checkid-num")]
        public JsonResult IdNumberIsUnique([FromBody] string identityNumber)
        {
            var _check = _uow.Staff.GetFirstOrDefault(i => i.IdentityNumber == identityNumber);
            if (_check == null)
                return Json(true);
            return Json(false);
        }

        [HttpDelete("api/checkid-num")]
        public JsonResult DeleteTest(string id)
        {
            return Json(false);
        }
        [HttpGet("api/remove-member/{id}")]
        public ToastMessageVM RemoveMember(int id)
        {
            var _familyMember = _uow.FamilyMembers.GetFirstOrDefault(i => i.Id == id);
            /*
            _uow.FamilyMembers.Remove(_familyMember);
            _uow.Save();*/
            var _message = new ToastMessageVM()
            {
                Header = "Family member has been removed.",
                Message = " Removed Member: <h6>" + _familyMember.FullName + "</h6>",
                Icon = Toast.Icon.Success,
                ShowHideTransition = Toast.ShowHideTransition.Slide
            };
            /*
            var _message = new ToastMessageVM()
            {
                Header = "Family member cannot removed.",
                Message = " Remove Error: <h6>" + _familyMember.FullName + "</h6>",
                HideAfter = Toast.HideAfter.Long,
                Icon = Toast.Icon.Warning,
                ShowHideTransition = Toast.ShowHideTransition.Slide
            };*/
            return _message;
        }
        [HttpPost]
        public FamilyMembers AddMember([FromBody] FamilyMembers familyMembers)
        {
            _uow.FamilyMembers.Add(familyMembers);
            _uow.Save();
            return null;//aynı zamanda html tr de eklenebilir. Burdan ajax success e object gönderilebilir!
        }
        [HttpGet("api/statusofstaff")]
        public StatusOfStaffVM GetActive()
        {
            /*var staffs = _uow.Staff.GetAll();
            var active = staffs.Where(x => x.Status == (int)StatusOfStaff.Active).Count();
            var passive = staffs.Where(x => x.Status == (int)StatusOfStaff.Passive).Count();
            var quit = staffs.Where(x => x.Status == (int)StatusOfStaff.Quit).Count();*/
            var _statusofstaff = new StatusOfStaffVM()
            {
                Active = _uow.Staff.GetAll(i => i.Status == 0).Count(),
                Passive = _uow.Staff.GetAll(i => i.Status == 1).Count(),
                Quit = _uow.Staff.GetAll(i => i.Status == 2).Count()
            };
            return _statusofstaff;
        }
        [HttpGet("api/getcard/{tcid}")]
        public StaffVM Getcard(string tcid)
        {
            var _staff = _uow.Staff.GetFirstOrDefault(i => i.IdentityNumber == tcid);
            if (_staff == null)
                return null;

            var _marital = _uow.MaritalStatus.GetFirstOrDefault(i => i.Value == _staff.MaritalStatus);
            var _card = new StaffVM()
            {
                Guid = _staff.Guid,
                IdentityNumber = _staff.IdentityNumber,
                FirstName = _staff.FirstName,
                LastName = _staff.LastName,
                BirthPlace = _staff.BirthPlace,
                DateOfBirth_STR = _staff.DateOfBirth.ToString("dd/MM/yyyy"),
                MobileNumber = _staff.MobileNumber,
                MotherName = _staff.MotherName,
                FatherName = _staff.FatherName,
                Marital = _marital,
                NumberOfChildren = _staff.NumberOfChildren,
                TestD2_TNE = _staff.TestD2_TNE,
                TestD2_E = _staff.TestD2_E,
                ImageFile = _staff.ImageFile
            };
            return _card;
        }
        #endregion API
        public Claim GetClaim()
        {
            var claimsIdentity = (ClaimsIdentity)User.Identity;
            var Claims = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier);
            if (Claims != null)
            {
                return Claims;
            }
            return null;
        }
    }
}
