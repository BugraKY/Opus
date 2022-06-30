﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.ViewModels.Accounting;
using static Opus.Utility.ProjectConstant;

namespace Opus.Areas.Accounting.Controllers
{
    [Area("Accounting")]
    [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Accounting)]
    public class ReportingController : Controller
    {
        private readonly IUnitOfWork _uow;
        public ReportingController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("accounting/reporting/{id}")]
        public IActionResult Index(string id)
        {
            var _company = _uow.Accounting_Company.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
            return View("Index", _company);
        }
        #region API
        [HttpGet("api/accounting/getlistbydate/startingdate={startingdate}&endingdate={endingdate}&id={id}")]
        public IEnumerable<PurchaseBalance> GetListbydate(string startingdate, string endingdate, string id)
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
                }); //list with starting endingdate date
        }
        [HttpGet("api/accounting/calc-date-fromWeek/{week}")]
        public JsonResult CalcDatefromWeek(string week)
        {
            var testDate = new DateTime();
            var dayofyearDatetime = new DateTime();
            var splitVal = week.Split('-');
            var _year = int.Parse(splitVal[0]);
            var _week = int.Parse(splitVal[1].Replace("W", ""));

            dayofyearDatetime = dayofyearDatetime.AddYears(_year - 1);
            var dayofyear = dayofyearDatetime.DayOfYear;
            /*
            var asdf = System.Globalization.ISOWeek.GetWeeksInYear(_year);
            float _days = (_year*365)+(_week * 7);
            var test = dayofyear;*/

            return Json(null);
        }
        #endregion API
    }
}