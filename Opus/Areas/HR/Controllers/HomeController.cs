﻿using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using System.Security.Claims;
using Opus.Extensions;
using static Opus.Utility.ProjectConstant;
using Microsoft.AspNetCore.Identity;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using IronOcr;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class HomeController : Controller
    {
        private readonly IUnitOfWork _uow;
        private readonly IWebHostEnvironment _hostEnvironment;//wwwroot konum olarak erişim sağlar. Yani host dosyamızın ana dosyasına erişilir.
        private readonly RoleManager<IdentityRole> _roleManager;
        public HomeController(IUnitOfWork uow, IWebHostEnvironment hostEnvironment, RoleManager<IdentityRole> roleManager)
        {
            _uow = uow;
            _hostEnvironment = hostEnvironment;
            _roleManager = roleManager;
        }
        [Route("/")]
        public IActionResult Index()
        {
            #region Authentication Index
            if (GetClaim() != null)
            {
                return Redirect("/dashboard");//Go Dashboard
            }
            return Redirect("/signin");
            //return RedirectToAction("SignIn", "Account")
            #endregion Authentication Index
        }
        [Route("dashboard")]
        public IActionResult Dashboard()
        {
            if (GetClaim() != null)
            {
                return View();
            }
            return Redirect("/signin");
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
        [HttpGet("get-test")]
        public JsonResult Test()
        {
            var _object = _uow.Location.GetAll();
            return Json(_object);
        }
        [Route("add-vacation")]
        public IActionResult AddVacationDays()
        {
            var vacatins = new VacationVM()
            {
                EnumerableVacationDates= _uow.VacationDates.GetAll()
            };
            return View(vacatins);
        }
        [HttpPost("add-vacation")]
        public IActionResult AddVacationDaysPost(VacationVM vacatins)
        {
            var _vacation = new VacationDates()
            {
                Beginning=vacatins.Beginning,
                Ending=vacatins.Ending,
                Description=vacatins.Description
            };
            _uow.VacationDates.Add(_vacation);
            //_uow.Save();
            return RedirectToAction("AddVacationDays");
        }
        /*
        [HttpGet("api/test-ocr")]
        public string TestOCR()
        {
            var Ocr = new IronTesseract();
            using (var Input = new OcrInput("ocr-test-files/image.jpeg"))
            {
                // Input.Deskew();  // use if image not straight
                // Input.DeNoise(); // use if image contains digital noise
                var Result = Ocr.Read(Input);
                var ResultString = "";
                foreach (var item in Result.Words)
                {
                    ResultString += item.Text+",";
                }

                //string[] List = Result.Split(", ");
                //return Result.Text;
                return ResultString;
            }
        }
        */
    }
}
