using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels.Accounting;
using Opus.Models.ViewModels.Accounting;
using static Opus.Utility.ProjectConstant;

namespace Opus.Areas.Accounting.Controllers
{
    [Area("Accounting")]
    [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Accounting)]
    public class CurrentController : Controller
    {
        Utility.ForeignCurrency excRate = new Utility.ForeignCurrency();
        private readonly IUnitOfWork _uow;
        public CurrentController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("accounting/curr")]
        public IActionResult Index()
        {
            var comps=_uow.Accounting_Company.GetAll().OrderBy(s=>s.Sorting);
            return View(comps);
        }
        [Route("accounting/curr/{id}")]
        public IActionResult SelectFunc(string id)
        {
            return View(id);
        }
        [HttpGet("api/accounting/get-comps")]
        public IEnumerable<Company> Companies()
        {
            List<Company> companies = new List<Company>();
            var _comps = _uow.Accounting_Company.GetAll();
            foreach (var item in _comps)
            {
                var companyItem = new Company()
                {
                    Id = item.Id,
                    Name = item.Name
                };
                companies.Add(companyItem);
            }
            return companies;
        }
        [Route("accounting/curr/buying/{id}")]
        public IActionResult Buying(string id)
        {
            var _comp = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
            var _IdentifiType = _uow.Accounting_Identificationtype.GetFirstOrDefault(t => t.Identity == "SUP");
            var _buyingvm = new BuyingVM()
            {
                Company = _comp,
                Identification_Enuberable = _uow.Accounting_Identification.GetAll(i => i.CompanyId == _comp.Id).Where(i => i.IdentificationTypeId == _IdentifiType.Id),
            };

            return View(_buyingvm);
        }
        [HttpPost("accounting/curr/buying-post")]
        public IActionResult BuyingPost(BuyingVM _buyingVM)
        {

            var buyingvm = new BuyingVM()
            {
                Identification_Enuberable = _buyingVM.Identification_Enuberable,
                BuyingInput = _buyingVM.BuyingInput,
                IdentificationId = _buyingVM.IdentificationId,
                Identification=_uow.Accounting_Identification.GetFirstOrDefault(i=>i.Id== Guid.Parse(_buyingVM.IdentificationId)),
                PaymentMethId = _buyingVM.PaymentMethId
            };
            return NoContent();
        }
        
        [Route("api/accounting/foreign-currency/{_date}")]
        public ExchangeRate GetExchange(string _date)
        {
            var data=excRate.GetExchangeByDate(DateTime.Parse(DateTime.Parse(_date).ToString("dd/MM/yyyy")));
            return data;
        }
    }
}
