﻿using IbanNet;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Extensions;
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
                var staffs = _uow.Staff.GetAll().OrderByDescending(o => o.Status);
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
                    Products = _products.ToList(),
                    EducationalStatusEnumerable = _uow.EducationalStatus.GetAll()
                };
                return View(staffVM);
            }
            return NotFound();
            #endregion Authentication
        }
        [HttpGet("staff/edit/{id}")]
        public IActionResult Edit(Guid id)
        {
            List<StaffEquipment> _staffEquipments = new List<StaffEquipment>();
            var _staff = _uow.Staff.GetFirstOrDefault(x => x.Guid == id);
            var _familyMembers = _uow.FamilyMembers.GetAll(x => x.StaffId == _staff.Id.ToString(), includeProperties: "FamilyRelationship");
            var _staffEquipmentsEnum = _uow.StaffEquipment.GetAll(x => x.StaffId == _staff.Id);
            var _documents = _uow.Documents.GetAll(i => i.StaffId == _staff.Id);

            //we need getdocument Extensions!!
            var getDocuments = GetDocuments.GetByStaff(_documents);
            foreach (var item in _staffEquipmentsEnum)
            {
                var _product = _uow.Products.GetFirstOrDefault(i => i.Id == item.ProductId);
                var eq = new StaffEquipment()
                {
                    DeliveryDate = item.DeliveryDate,
                    Id = item.Id,
                    ProductId = item.ProductId,
                    Product = _product,
                    Quantity = item.Quantity,
                    ReturnDate = item.ReturnDate,
                    StaffId = item.StaffId
                };
                _staffEquipments.Add(eq);
            }
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
                DocumentRead = getDocuments,
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
                Id = _staff.Id

            };


            return View(staffVM);
        }
        [HttpPost("staff/updating")]
        public IActionResult Update(StaffVM _staffVM)
        {
            string webRootPath = _hostEnvironment.WebRootPath;
            CopyFileExtension copyFile = new CopyFileExtension(_uow);
            copyFile.Upload_UPSERT(_staffVM.Files,_staffVM.DocumentRead, webRootPath, _staffVM.Guid, _staffVM.Id);
            //return NoContent();
            if (_staffVM.ImageFile != null)
            {
                var _staff = new Staff()
                {
                    Id = _staffVM.Id,
                    Guid = _staffVM.Guid,
                    Active = _staffVM.Active,
                    IBAN = _staffVM.IBAN,
                    StreetAddress = _staffVM.StreetAddress,
                    BirthPlace = _staffVM.BirthPlace,
                    BlackList = _staffVM.BlackList,
                    BloodTypeId = _staffVM.BloodTypeId,
                    CountryId = _staffVM.CountryId,
                    CurrentSalary = _staffVM.CurrentSalary,
                    DateOfBirth = _staffVM.DateOfBirth,
                    DateOfEntry = _staffVM.DateOfEntry,
                    DateOfQuit = _staffVM.DateOfQuit,
                    Degree = _staffVM.Degree,
                    EducationalStatus = _staffVM.EducationalStatus,
                    FatherName = _staffVM.FatherName,
                    MotherName = _staffVM.MotherName,
                    FirstName = _staffVM.FirstName,
                    LastName = _staffVM.LastName,
                    IdentityNumber = _staffVM.IdentityNumber,
                    ImageFile = _staffVM.ImageFile,
                    MaritalStatus = _staffVM.MaritalStatus,
                    MobileNumber = _staffVM.MobileNumber,
                    NumberOfChildren = _staffVM.NumberOfChildren,
                    Status = _staffVM.Status,
                    PhoneNumber = _staffVM.PhoneNumber,
                    PhoneNumberSec = _staffVM.PhoneNumberSec,
                    RegistrationNumber = _staffVM.RegistrationNumber,
                    TestD2_TNE = _staffVM.TestD2_TNE,
                    TestD2_E = float.Parse(_staffVM.TestD2_E_STR.Replace('.', ',')),
                    WhiteCollarWorker = _staffVM.WhiteCollarWorker
                };
                _uow.Staff.Update(_staff);
            }
            else
            {
                var imageFıle = _uow.Staff.GetFirstOrDefault(i => i.Guid == _staffVM.Guid).ImageFile;
                var _staff = new Staff()
                {
                    Id = _staffVM.Id,
                    Guid = _staffVM.Guid,
                    Active = _staffVM.Active,
                    IBAN = _staffVM.IBAN,
                    StreetAddress = _staffVM.StreetAddress,
                    BirthPlace = _staffVM.BirthPlace,
                    BlackList = _staffVM.BlackList,
                    BloodTypeId = _staffVM.BloodTypeId,
                    CountryId = _staffVM.CountryId,
                    CurrentSalary = _staffVM.CurrentSalary,
                    DateOfBirth = _staffVM.DateOfBirth,
                    DateOfEntry = _staffVM.DateOfEntry,
                    DateOfQuit = _staffVM.DateOfQuit,
                    Degree = _staffVM.Degree,
                    EducationalStatus = _staffVM.EducationalStatus,
                    FatherName = _staffVM.FatherName,
                    MotherName = _staffVM.MotherName,
                    FirstName = _staffVM.FirstName,
                    LastName = _staffVM.LastName,
                    IdentityNumber = _staffVM.IdentityNumber,
                    //ImageFile = _uow.Staff.GetFirstOrDefault(i => i.Guid == _staffVM.Guid).ImageFile.ToString(),
                    MaritalStatus = _staffVM.MaritalStatus,
                    MobileNumber = _staffVM.MobileNumber,
                    NumberOfChildren = _staffVM.NumberOfChildren,
                    Status = _staffVM.Status,
                    PhoneNumber = _staffVM.PhoneNumber,
                    PhoneNumberSec = _staffVM.PhoneNumberSec,
                    RegistrationNumber = _staffVM.RegistrationNumber,
                    TestD2_TNE = _staffVM.TestD2_TNE,
                    TestD2_E = float.Parse(_staffVM.TestD2_E_STR.Replace('.', ',')),
                    WhiteCollarWorker = _staffVM.WhiteCollarWorker
                };
                _uow.Staff.Update(_staff);
            }

            if (_staffVM.StaffEquipmentEnumerable != null)
            {
                foreach (var item in _staffVM.StaffEquipmentEnumerable)
                {
                    var _staffEqu = new StaffEquipment()
                    {
                        Id = item.Id,
                        DeliveryDate = item.DeliveryDate,
                        ProductId = item.ProductId,
                        StaffId = _staffVM.Id,
                        Quantity = item.Quantity,
                        ReturnDate = item.ReturnDate
                    };
                    _uow.StaffEquipment.Add(_staffEqu);
                }
            }
            if (_staffVM.FamilyMembersEnumerable != null)
            {
                foreach (var item in _staffVM.FamilyMembersEnumerable)
                {
                    var _staffFamily = new FamilyMembers()
                    {
                        Id = item.Id,
                        BirthPlace = item.BirthPlace,
                        DateOfBirth = item.DateOfBirth,
                        FamilyRelationshipId = item.FamilyRelationshipId,
                        FullName = item.FullName,
                        IdentityNumber = item.IdentityNumber,
                        StaffId = _staffVM.Id.ToString(),
                    };
                    _uow.FamilyMembers.Add(_staffFamily);
                }
            }
            _uow.Save();


            //return NoContent();
            return Redirect("/staff/edit/" + _staffVM.Guid);
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
            var test = staffVm.TestD2_E;
            return NoContent();
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
        [HttpPost("staff/multiple-upsert")]
        public IActionResult MultipleUpsert(StaffVM staffVm)
        {
            IList<Staff> _staffs = new List<Staff>();
            foreach (var item in staffVm.ChecksVMEnumerable)
            {
                if (item.Checked)
                {
                    var _staff = _uow.Staff.GetFirstOrDefault(i => i.Guid == item.Guid);
                    _staffs.Add(_staff);
                }

            }
            return View(_staffs);
            //return NoContent();
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
            ToastMessageVM _message = new ToastMessageVM();
            var _familyMember = _uow.FamilyMembers.GetFirstOrDefault(i => i.Id == id);
            try
            {
                _uow.FamilyMembers.Remove(_familyMember);
                _uow.Save();
                var vm = new ToastMessageVM()
                {
                    Header = "Family member has been removed.",
                    Message = " Removed Member: <h6>" + _familyMember.FullName + "</h6>",
                    Icon = Toast.Icon.Success,
                    ShowHideTransition = Toast.ShowHideTransition.Slide
                };
                _message = vm;
            }
            catch (Exception ex)
            {
                var vm = new ToastMessageVM()
                {
                    Header = "Error.",
                    Message = "Error at remove: " + ex.InnerException.Message + " - <h6>" + _familyMember.FullName + "</h6>",
                    Icon = Toast.Icon.Success,
                    ShowHideTransition = Toast.ShowHideTransition.Slide
                };
                _message = vm;
            }
            return _message;
        }
        [HttpGet("api/remove-equipment/{id}")]
        public ToastMessageVM RemoveEquipment(int id)
        {
            ToastMessageVM _message = new ToastMessageVM();
            var _equipment = _uow.StaffEquipment.GetFirstOrDefault(i => i.Id == id);
            var _product = _uow.Products.GetFirstOrDefault(i => i.Id == _equipment.ProductId);
            try
            {
                _uow.StaffEquipment.Remove(_equipment);
                _uow.Save();
                var vm = new ToastMessageVM()
                {
                    Header = "Staff equipment has been removed.",
                    Message = " Removed Equipment: <h6>" + _product.Name + "</h6>",
                    Icon = Toast.Icon.Success,
                    ShowHideTransition = Toast.ShowHideTransition.Slide
                };
            }
            catch (Exception ex)
            {
                var vm = new ToastMessageVM()
                {
                    Header = "Error.",
                    Message = "Error at remove: " + ex.InnerException.Message + " - <h6>" + _product.Name + "</h6>",
                    Icon = Toast.Icon.Success,
                    ShowHideTransition = Toast.ShowHideTransition.Slide
                };
                _message = vm;
            }
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

        [HttpPost("api/single-upsert")]
        public IEnumerable<Staff> UpsertSingleApi([FromBody] IEnumerable<UpsertMultipleVM> upsertobjEnum)
        {
            List<Staff> _staffs = new List<Staff>();
            foreach (var item in upsertobjEnum)
            {
                var _staff = _uow.Staff.GetFirstOrDefault(i => i.Guid == Guid.Parse(item.Key));
                _staff.CurrentSalary = item.Data.CurrentSalary;
                _staffs.Add(_staff);
            }
            _uow.Staff.UpdateRange(_staffs);
            _uow.Save();
            return _staffs;
        }
        [HttpPost("api/multiple-upsert")]
        public IEnumerable<Staff> UpsertMultipleApi([FromBody] IEnumerable<UpsertMultipleVM> upsertobjEnum)
        {
            List<Staff> _staffs = new List<Staff>();
            foreach (var item in upsertobjEnum)
            {
                var _staff = _uow.Staff.GetFirstOrDefault(i => i.Guid == Guid.Parse(item.Key));
                _staff.CurrentSalary = item.CurrentSalary;
                _staffs.Add(_staff);
            }
            _uow.Staff.UpdateRange(_staffs);
            _uow.Save();
            return _staffs;
        }
        [HttpPost("api/get-multiple")]
        public IEnumerable<Staff> GetMultipleApi([FromBody] IEnumerable<Staff> staffs)
        {

            return null;
        }
        [HttpGet("api/getbank/{bankCode}/{iban}")]
        public BankCodesVM GetBank(int bankCode, string iban)
        {
            IIbanValidator validator = new IbanValidator();
            ValidationResult validationResult = validator.Validate(iban);
            ValidateBank _validate = new ValidateBank(_hostEnvironment);
            if (validationResult.IsValid)
            {
                var bank = _validate.Validate(bankCode);
                return bank;
            }
            return null;

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
