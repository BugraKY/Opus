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
        public async Task<IActionResult> AddAsync(StaffVM staff)
        {
            IList<Products> _products = new List<Products>();
            List<StaffEquipment> _staffEquipments = new List<StaffEquipment>();
            int i = 0;
            foreach (var item in staff.StaffEquipment.ProductId)
            {
                var _product = _uow.Products.GetFirstOrDefault(i => i.Id == item);
                var _staffEquipment = new StaffEquipment()
                {
                    ProductId = _product.Id,
                    Quantity = staff.StaffEquipment.Quantity[i],
                    DeliveryDate = staff.StaffEquipment.DeliveryDate[i],
                    ReturnDate = staff.StaffEquipment.ReturnDate[i]
                };
                _products.Add(_product);
                _staffEquipments.Add(_staffEquipment);
                i++;
            }/*
            foreach (var item in _products) 
            { 

            }*/
            await Task.Delay(1);
            var StaffEquipment = staff.StaffEquipment;
            return NoContent();
            #region Authentication
            if (GetClaim() != null)
            {
                return View();//Go Dashboard
            }
            return NotFound();
            #endregion Authentication
        }
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
