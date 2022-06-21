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
            double vat = 0;
            double outofVat = 0;
            double discount = 0;
            double totalAmount = 0;
            int i=0;
            List<TagDefinitions> _tagDefinitions = new List<TagDefinitions>();
            foreach (var item in _buyingVM.BuyingInput.Enumerable_BuyingDetails)
            {
                vat+=item.Vat;
                outofVat += item.Total;
                discount += item.Discount;
                //_tagDefinitions
                _buyingVM.BuyingInput.Enumerable_BuyingDetails[i].TagDefinitions = _uow.Accounting_TagDefinations.
                    GetFirstOrDefault(i => i.Id == item.TagDefinitionsId,includeProperties: "Category,SubCategory,Tag");
                i++;
            }
            _buyingVM.BuyingInput.PaymentMethId = _buyingVM.PaymentMethId;
            totalAmount = (outofVat + vat) - discount;
            _buyingVM.BuyingInput.Vat = (float)Math.Round(vat,2);
            _buyingVM.BuyingInput.OutofVat = (float)Math.Round(outofVat,2);
            _buyingVM.BuyingInput.Discount = (float)Math.Round(discount,2);
            _buyingVM.BuyingInput.TotalAmount = (float)Math.Round(totalAmount,2);
            //_uow.buyingdetails.addrange(_buyingVM.BuyingInput.Enumerable_BuyingDetails)
            //_uow.buyinginput.add(_buyingVM.BuyingInput)-->dbclassta kalıtsal yolla view-model classa tanımlamalı.
            return NoContent();
        }
        
        [Route("api/accounting/foreign-currency/{_date}")]
        public async Task<Models.ViewModels.Accounting.ExchangeRate> GetExchange(string _date)
        {
            var data = await excRate.GetExchangeByDate(DateTime.Parse(DateTime.Parse(_date).ToString("dd/MM/yyyy"))).ConfigureAwait(false);
            return data;
        }
    }
}
