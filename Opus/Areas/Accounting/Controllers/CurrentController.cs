﻿using Microsoft.AspNetCore.Authorization;
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
            var comps = _uow.Accounting_Company.GetAll().OrderBy(s => s.Sorting);
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
                Enumerable_PurchaseInvoice = _uow.Accounting_PurchaseInvoice.GetAll(i => i.CompanyId == _comp.Id, includeProperties: "Identification,PaymentMeth,ExchangeRate"),
            };
            return View(_buyingvm);
        }
        [HttpPost("accounting/curr/buying-post")]
        public IActionResult BuyingPost(BuyingVM _buyingVM)
        {
            double vat = 0, vat_01 = 0, vat_08 = 0, vat_18 = 0;
            double outofVat = 0;
            double discount = 0;
            double totalAmount = 0;
            int i = 0;
            var _purchaseCheck = _uow.Accounting_PurchaseInvoice.GetFirstOrDefault(i => i.DocNo == _buyingVM.PurchaseInvoice.DocNo);
            if (_purchaseCheck == null)
            {
                foreach (var item in _buyingVM.Enumerable_PurchaseInvoiceDetails)
                {
                    if (item.Vat_Rate == float.Parse("1,01"))
                    {
                        vat_01 += item.Vat;
                    }
                    if (item.Vat_Rate == float.Parse("1,08"))
                    {
                        vat_08 += item.Vat;
                    }

                    if (item.Vat_Rate == float.Parse("1,18"))
                    {
                        vat_18 += item.Vat;
                    }
                    vat += item.Vat;
                    outofVat += item.Total;
                    discount += item.Discount;
                }
                _buyingVM.PurchaseInvoice.PaymentMethId = _buyingVM.PaymentMethId;
                totalAmount = (outofVat + vat) - discount;
                _buyingVM.PurchaseInvoice.Vat = (float)Math.Round(vat, 2);
                _buyingVM.PurchaseInvoice.Vat_1 = (float)Math.Round(vat_01, 2);
                _buyingVM.PurchaseInvoice.Vat_8 = (float)Math.Round(vat_08, 2);
                _buyingVM.PurchaseInvoice.Vat_18 = (float)Math.Round(vat_18, 2);
                _buyingVM.PurchaseInvoice.OutofVat = (float)Math.Round(outofVat, 2);
                _buyingVM.PurchaseInvoice.Discount = (float)Math.Round(discount, 2);
                _buyingVM.PurchaseInvoice.TotalAmount = (float)Math.Round(totalAmount, 2);
                _uow.Accounting_PurchaseInvoice.Add(_buyingVM.PurchaseInvoice);

                foreach (var item in _buyingVM.Enumerable_PurchaseInvoiceDetails)
                {
                    _buyingVM.Enumerable_PurchaseInvoiceDetails[i].PurchaseInvoiceId = _buyingVM.PurchaseInvoice.Id;
                    i++;
                }
                _uow.Accounting_PurchaseInvoiceDetails.AddRange(_buyingVM.Enumerable_PurchaseInvoiceDetails);
                _uow.Save();
                return Redirect("/accounting/curr/buying/" + _buyingVM.PurchaseInvoice.CompanyId.ToString());
                //return NoContent();
            }
            else
            {
                return Content("This number has already been added to the invoice. Document Number: " + _purchaseCheck.DocNo);
            }
        }
        [Route("accounting/curr/buying/detail/{id}")]
        public IActionResult BuyingDetail(string id)
        {
            var _purchaseInvoise = _uow.Accounting_PurchaseInvoice.GetFirstOrDefault(i => i.Id == Guid.Parse(id), includeProperties: "Identification,PaymentMeth,ExchangeRate");
            var _purchaseInvoiseDetails = _uow.Accounting_PurchaseInvoiceDetails.GetAll(i => i.PurchaseInvoiceId == _purchaseInvoise.Id, includeProperties: "TagDefinitions").ToList();
            int i = 0;
            var _isdiscount = false;
            foreach (var item in _purchaseInvoiseDetails)
            {
                _purchaseInvoiseDetails[i].TagDefinitions.Category = _uow.Accounting_Category.GetFirstOrDefault(i => i.Id == item.TagDefinitions.CategoryId);
                _purchaseInvoiseDetails[i].TagDefinitions.SubCategory = _uow.Accounting_Subcategory.GetFirstOrDefault(i => i.Id == item.TagDefinitions.SubCategoryId);
                _purchaseInvoiseDetails[i].TagDefinitions.Tag = _uow.Accounting_Tag.GetFirstOrDefault(i => i.Id == item.TagDefinitions.TagId);
                if (_purchaseInvoiseDetails[i].Discount > 0)
                    _isdiscount = true;
                i++;
            }
            var _buying = new BuyingVM
            {
                Company = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == _purchaseInvoise.CompanyId),
                CompanyId = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == _purchaseInvoise.CompanyId).Id.ToString(),
                PurchaseInvoice = _purchaseInvoise,
                Enumerable_PurchaseInvoiceDetails = _purchaseInvoiseDetails,
                IsDiscount = _isdiscount
            };

            return View(_buying);
        }
        [Route("accounting/curr/buying/del/{id}")]
        public IActionResult BuyingDel(string id)
        {
            var _purchaseInvoice = _uow.Accounting_PurchaseInvoice.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
            _uow.Accounting_PurchaseInvoice.Remove(_purchaseInvoice);
            _uow.Save();
            return Redirect("/accounting/curr/buying/" + _purchaseInvoice.CompanyId);
        }
        [Route("api/accounting/foreign-currency/{_date}")]
        public async Task<Models.ViewModels.Accounting.ExchangeRate> GetExchange(string _date)
        {
            var data = await excRate.GetExchangeByDate(DateTime.Parse(DateTime.Parse(_date).ToString("dd/MM/yyyy"))).ConfigureAwait(false);
            return data;
        }
        [Route("api/accounting/check-docno/{docno}")]
        public bool CheckDocNo(string docno)
        {
            var _purchaseCheck = _uow.Accounting_PurchaseInvoice.GetFirstOrDefault(i => i.DocNo == docno);
            if (_purchaseCheck == null)
                return true;
            else
                return false;
        }
        [Route("accounting/curr/buying/edit/{id}")]
        public IActionResult BuyingEdit(string id)
        {
            var _purchaseInvoise = _uow.Accounting_PurchaseInvoice.GetFirstOrDefault(i => i.Id == Guid.Parse(id), includeProperties: "Identification,PaymentMeth,ExchangeRate");
            var _purchaseInvoiseDetails = _uow.Accounting_PurchaseInvoiceDetails.GetAll(i => i.PurchaseInvoiceId == _purchaseInvoise.Id, includeProperties: "TagDefinitions").ToList();
            int i = 0;
            var _isdiscount = false;
            var _identificatins = _uow.Accounting_Identification.GetAll(includeProperties: "IdentificationType").Where(i => (i.CompanyId == _purchaseInvoise.CompanyId && i.IdentificationType.Identity == "SUP" && i.Active));
            var _identificatin = _uow.Accounting_Identification.GetFirstOrDefault(i => i.Id == _purchaseInvoise.IdentificationId);
            foreach (var item in _purchaseInvoiseDetails)
            {
                _purchaseInvoiseDetails[i].TagDefinitions.Category = _uow.Accounting_Category.GetFirstOrDefault(i => i.Id == item.TagDefinitions.CategoryId);
                _purchaseInvoiseDetails[i].TagDefinitions.SubCategory = _uow.Accounting_Subcategory.GetFirstOrDefault(i => i.Id == item.TagDefinitions.SubCategoryId);
                _purchaseInvoiseDetails[i].TagDefinitions.Tag = _uow.Accounting_Tag.GetFirstOrDefault(i => i.Id == item.TagDefinitions.TagId);
                if (_purchaseInvoiseDetails[i].Discount > 0)
                    _isdiscount = true;
                i++;
            }
            var _buying = new BuyingVM
            {
                Company = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == _purchaseInvoise.CompanyId),
                CompanyId = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == _purchaseInvoise.CompanyId).Id.ToString(),
                PurchaseInvoice = _purchaseInvoise,
                Enumerable_PurchaseInvoiceDetails = _purchaseInvoiseDetails,
                Identification_Enuberable = _identificatins,
                Identification = _identificatin,
                IsDiscount = _isdiscount
            };

            return View(_buying);
        }
        [Route("accounting/curr/account-balance/{id}")]
        public IActionResult AccountBalance(string id)
        {
            IdentificationIndexVM identificationIndex = new IdentificationIndexVM();
            int x = 0;
            try
            {
                identificationIndex.CompanyItem = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
                identificationIndex.IdentificationType_Enumerable = _uow.Accounting_Identificationtype.GetAll();
                identificationIndex.Bank_Enumerable = _uow.Accounting_Bank.GetAll();
                identificationIndex.Departmant_Enumerable = _uow.Accounting_Departmant.GetAll();
                if (identificationIndex.CompanyItem == null || identificationIndex.IdentificationType_Enumerable.Count() == 0 ||
                    identificationIndex.Bank_Enumerable.Count() == 0 || identificationIndex.Departmant_Enumerable.Count() == 0)
                {
                    return Redirect("/accounting/identifications");
                }
                /*
                identificationIndex.Identification_Enumerable = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank,PurchaseInvoiceCollection")
                    .Where(a => a.Active).OrderBy(i => i.IdNumber).ToList();*/
                
                /*
                foreach (var item in identificationIndex.Identification_Enumerable)
                {
                    identificationIndex.Identification_Enumerable[x].Balance_TRY = _uow.Accounting_PurchaseInvoice.GetAll(i => i.IdentificationId == item.Id).Where(f => f.ExchangeRateId == 1).Sum(s => s.TotalAmount);
                    identificationIndex.Identification_Enumerable[x].Balance_USD = _uow.Accounting_PurchaseInvoice.GetAll(i => i.IdentificationId == item.Id).Where(f => f.ExchangeRateId == 2).Sum(s => s.TotalAmount);
                    identificationIndex.Identification_Enumerable[x].Balance_EUR = _uow.Accounting_PurchaseInvoice.GetAll(i => i.IdentificationId == item.Id).Where(f => f.ExchangeRateId == 3).Sum(s => s.TotalAmount);
                    identificationIndex.Identification_Enumerable[x].NumberOfInvoices = _uow.Accounting_PurchaseInvoice.GetAll(i => i.IdentificationId == item.Id).Count();
                    x++;
                }
                identificationIndex.Balance_TRY_Total = identificationIndex.Identification_Enumerable.Sum(i => i.Balance_TRY);
                identificationIndex.Balance_USD_Total = identificationIndex.Identification_Enumerable.Sum(i => i.Balance_USD);
                identificationIndex.Balance_EUR_Total = identificationIndex.Identification_Enumerable.Sum(i => i.Balance_EUR);
                */
                /*
                var deneme4 = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank,PurchaseInvoiceCollection")
                    .SelectMany(r => r.PurchaseInvoiceCollection)
                    .GroupBy(g => g.Identification)
                    .Select(s => new
                    {
                        Item = s.Key,
                        TRY = s.Where(c => c.ExchangeRateId == 1).Sum(s => s.TotalAmount),
                        USD = s.Where(c => c.ExchangeRateId == 2).Sum(s => s.TotalAmount),
                        EUR = s.Where(c => c.ExchangeRateId == 3).Sum(s => s.TotalAmount)
                    });
                */
                //Working

                //identificationIndex.PurchaseBalance_Enumerable=deneme4;

                /*
                var deneme3 = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank")
                    .SelectMany(r => r.PurchaseInvoices)
                    .GroupBy(ri => ri.IdentificationId)
                    .Select(g => new
                    {
                        Item=g.Key,
                        Quantity = g.Sum(ri => ri.TotalAmount)
                    });
                */

                /*
                var deneme2 = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank")
                    .Join(_uow.Accounting_PurchaseInvoice.GetAll(),
                    s => s.Id,
                    sa => sa.IdentificationId,
                    (s, sa) => new { identification = s, purchaseInvoice = sa })
                    .Where(a =>(a.identification.Active && a.purchaseInvoice.ExchangeRateId==1)).Select(a=>a.identification)*//*.Sum(a=>a.purchaseInvoice.TotalAmount)*/
                /*.OrderBy(i => i.identification.IdNumber).ToList();*/

                /*
                identificationIndex.Identification_Enumerable = _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank")
                    .Where(a => a.Active).Select(g => new
                    {
                        g.
                    }
                    )OrderBy(i => i.IdNumber).ToList();
                */
                /*
                var _purchase = _uow.Accounting_PurchaseInvoice.GetAll();
                var orn = (List<Identification>)_uow.Accounting_Identification.GetAll()
                    .Join(_purchase,

                    i => i.Id,
                    p => p.IdentificationId,
                    (i, p) => new { identification = i, purchaseInvoice = p }).Where(i => i.purchaseInvoice.ExchangeRateId == 1);*/
                //.GroupBy(i=>i.identification.Balance_TRY)
                //.Sum(s => s.purchaseInvoice.TotalAmount);


                /*
                var _orn = _uow.Accounting_PurchaseInvoice.GetAll(includeProperties:"Identification").GroupBy(x => x.Identification).Select(g => new
                {
                    identification = g.Key,
                    Total = g.Sum(x=>x.TotalAmount)
                });
                */

                /*
                var orn = _uow.Staff.GetAll()
                .Join(staffResignation,
                s => s.Id,
                r => r.StaffId,
                (s, r) => new { staffs = s, staffResignation = r })
                .Where(i => (i.staffs.Active && i.staffs.Status == 0) || (i.staffs.Active == false && i.staffs.Status == 1) && i.staffs.BlackList == false)
                .Select(s => s.staffs)
                .OrderBy(n => n.FirstName);
                 
                 
                 */

                /*
                var deneme = _uow.Accounting_PurchaseInvoice.GetAll().GroupBy(c=>c.IdentificationId).
                    Select(g=> new
                    {
                        g.Key,
                        Sum =g.Sum(s=>s.TotalAmount.Select)
                    });
                */
                /*
                var catgroup = db.CATEGORies.GroupBy(c => c.CATNAME).
                  Select(g => new
                  {
                      g.Key,
                      SUM = g.Sum(s => s.Inqueries.Select(t => t.TotalTimeSpent).Sum())
                  });*/
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                    return Content(ex.InnerException.Message);
                else
                    return Content(ex.Message);
            }

            return View(identificationIndex);
        }

        [HttpGet("api/accounting/getBalance/startingdate={startingdate}&endingdate={endingdate}&id={id}")]
        public IEnumerable<PurchaseBalance> GetBalance(string startingdate, string endingdate, string id)
        {
            var _startingDate = DateTime.Parse(startingdate);
            var _endingdate = DateTime.Parse(endingdate);
            return _uow.Accounting_Identification.GetAll(i => i.CompanyId == Guid.Parse(id), includeProperties: "IdentificationType,Company,Bank,PurchaseInvoiceCollection")
                .Where(a => (a.Active))
                .SelectMany(r => r.PurchaseInvoiceCollection.
                    Where(d => (d.DocDate >= DateTime.Parse(startingdate) && d.DocDate <= DateTime.Parse(endingdate))))
                .GroupBy(g => g.Identification)
                .Select(s => new PurchaseBalance()
                {
                    Id = s.Key.Id,
                    Active = s.Key.Active,
                    IdNumber = s.Key.IdNumber,
                    IdentityCode = s.Key.IdentityCode,
                    CommercialTitle = s.Key.CommercialTitle,
                    PaymentTerm = s.Key.PaymentTerm,
                    NumberOfInvoices = s.Key.PurchaseInvoiceCollection.Where(d => (d.DocDate >= DateTime.Parse(startingdate) && d.DocDate <= DateTime.Parse(endingdate))).Count(),
                    Balance_TRY = s.Where(c => c.ExchangeRateId == 1).Sum(s => s.TotalAmount),
                    Balance_USD = s.Where(c => c.ExchangeRateId == 2).Sum(s => s.TotalAmount),
                    Balance_EUR = s.Where(c => c.ExchangeRateId == 3).Sum(s => s.TotalAmount)
                });
        }

        public IdentificationIndexVM SumInvoiceTotals()
        {/*
            var _identification = new IdentificationIndexVM();
            _identification.Balance_TRY_Total=_uow*/
            return null;
        }
    }
}
