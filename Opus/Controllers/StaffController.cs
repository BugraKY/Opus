using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using System.Security.Claims;
using static Opus.Utility.Enums;

namespace Opus.Controllers
{
    public class StaffController : Controller
    {
        private readonly IUnitOfWork _uow;
        public StaffController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("staff")]
        public IActionResult Index()
        {
            #region Authentication
            if (GetClaim() != null)
            {
                var staffs = _uow.Staff.GetAll();
                ViewBag.TotalActive = staffs.Where(x => x.Status == (int)StatusOfStaff.Active).Count();
                ViewBag.TotalPassive = staffs.Where(x => x.Status == (int)StatusOfStaff.Passive).Count();
                ViewBag.TotalExit = staffs.Where(x => x.Status == (int)StatusOfStaff.Quit).Count();
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
        [HttpPost("staff/add")]
        public async Task<IActionResult> AddAsync(StaffVM staffVm)
        {
            IList<Products> _products = new List<Products>();
            List<StaffEquipment> _staffEquipments = new List<StaffEquipment>();
            List<FamilyMembers> _familyMembers = new List<FamilyMembers>();
            int i = 0;
            foreach (var item in staffVm.StaffEquipment.ProductId)
            {
                var _product = _uow.Products.GetFirstOrDefault(i => i.Id == item);
                var _staffEquipment = new StaffEquipment()
                {
                    ProductId = _product.Id,
                    Quantity = staffVm.StaffEquipment.Quantity[i],
                    DeliveryDate = staffVm.StaffEquipment.DeliveryDate[i],
                    ReturnDate = staffVm.StaffEquipment.ReturnDate[i]
                };
                _products.Add(_product);
                _staffEquipments.Add(_staffEquipment);
                i++;
            }
            var _staff = new Staff()
            {
                Active = staffVm.Active,
                IBAN = staffVm.IBAN,
                StreetAddress = staffVm.StreetAddress,
                TestMSA = staffVm.TestMSA,
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
                ImageFile = staffVm.ImageFile,
                MaritalStatus = staffVm.MaritalStatus,
                MobileNumber = staffVm.MobileNumber,
                MotherName = staffVm.MotherName,
                NumberOfChildren = staffVm.NumberOfChildren,
                PhoneNumber = staffVm.PhoneNumber,
                PhoneNumberSec = staffVm.PhoneNumberSec,
                RegistrationNumber = staffVm.RegistrationNumber,
                Status = staffVm.Status,
                TestD2 = staffVm.TestD2,
                WhiteCollarWorker = staffVm.WhiteCollarWorker
            };
            _uow.Staff.Add(_staff);
            i = 0;
            foreach (var item in staffVm.FamilyMembers.IdentityNumber)
            {
                var _familyMember = new FamilyMembers()
                {
                    BirthPlace = staffVm.FamilyMembers.BirthPlace[i],
                    DateOfBirth = DateTime.Parse(staffVm.FamilyMembers.DateOfBirth[i]),
                    FamilyRelationshipId = staffVm.FamilyMembers.FamilyRelationshipId[i],
                    FullName = staffVm.FamilyMembers.FullName[i],
                    IdentityNumber = item,
                    StaffId = _staff.Id.ToString()
                };
                i++;
            }
            var _bloodtype = _uow.BloodType.GetFirstOrDefault(i => i.Id == staffVm.BloodTypeId);
            staffVm.BloodType = _bloodtype;

            _uow.StaffEquipment.AddRange(_staffEquipments);
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
