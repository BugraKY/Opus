using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels.Accounting;
using Opus.Models.ViewModels.Accounting;
using Opus.Utility;
using static Opus.Utility.ProjectConstant;

namespace Opus.Areas.Accounting.Controllers
{
    [Area("Accounting")]
    
    public class CompanyController : Controller
    {
        private readonly IUnitOfWork _uow;
        private readonly IWebHostEnvironment _hostEnvironment;
        public CompanyController(IUnitOfWork uow, IWebHostEnvironment hostEnvironment)
        {
            _uow = uow;
            _hostEnvironment = hostEnvironment;
        }
        [Route("accounting/comp")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Accounting)]
        public IActionResult Index()
        {
            return View();
        }
        [Route("accounting/add-comp")]
        [Authorize(Roles = UserRoles.Admin)]
        public IActionResult Add()
        {
            return View();
        }
        [Route("accounting/upsert-comp")]
        [Authorize(Roles = UserRoles.Admin)]
        public IActionResult Upsert(CompanyVM comp)
        {
            var _company = new Company()
            {
                Description=comp.Description,
                ImageFile=comp.ImageFile.FileName,
                Name=comp.Name,
                TaxNo=comp.TaxNo,
            };
            _uow.Accounting_Company.Add(_company);

            if (comp.ImageFile != null)
            {
                CopyFileExtension copyFile = new CopyFileExtension(_uow);
                copyFile.Upload(staffVm.Files, webRootPath, StaffUid, staffId, staffVm.ImageBase64);
            }
            return NoContent();
            return View();
        }
        [Authorize(Roles = UserRoles.Admin)]
        public IActionResult Update()
        {
            return View();
        }
    }
}
