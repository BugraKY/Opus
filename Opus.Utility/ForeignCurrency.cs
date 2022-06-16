using Opus.Models.ViewModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Opus.Utility
{
    public class ForeignCurrency
    {
        public string exchangeRate_TODAY = "http://www.tcmb.gov.tr/kurlar/today.xml";
        public string exchangeRate_Example = "https://www.tcmb.gov.tr/kurlar/202206/01062022.xml";
        public string exchangeRate = "https://www.tcmb.gov.tr/kurlar/";
        public XmlDocument getExchange()
        {
            //string exchangeRate = “http://www.tcmb.gov.tr/kurlar/today.xml";
            var xmlDoc = new XmlDocument();
            xmlDoc.Load(exchangeRate_TODAY);
            return xmlDoc;
            
        }
        public async Task<ExchangeRate> GetExchangeByDate(DateTime _date)
        {

            var Year = _date.ToString("yyyy");
            var Month = _date.ToString("MM");
            var Day = _date.ToString("dd");
            string _usd = "";
            string _eur = "";
            string _gbp = "";

            _date =_date.AddDays(-1);


            /*
             * Özel günler her yıl veri tabanına kaydedilecek.
            if(Month=="04"&&Day=="23")
                _date = _date.AddDays(-1);

            */

            if (_date.DayOfWeek==DayOfWeek.Saturday)
                _date = _date.AddDays(-1);
            if (_date.DayOfWeek == DayOfWeek.Sunday)
                _date = _date.AddDays(-2);
            if(_date>DateTime.Now.AddDays(-1))
            {
                _date = DateTime.Now.AddDays(-1);
            }
            Year = _date.ToString("yyyy");
            Month = _date.ToString("MM");
            Day = _date.ToString("dd");
            var Monthly = Year + Month;
            var AllDate = Day + Month + Year;
            var DateURL = Monthly + "/" + AllDate + ".xml";
            exchangeRate += DateURL;

            var xmlDoc = new XmlDocument();
            bool _break = true;
            HttpClient client = new HttpClient();

            /*var pageContents = await response.Content.ReadAsStringAsync();*/


            var responseBank = await client.GetAsync(exchangeRate_TODAY);
            if (responseBank.StatusCode == HttpStatusCode.OK)
            {
                while (_break)
                {
                    var response = await client.GetAsync(exchangeRate);
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        _break = false;
                        xmlDoc.Load(exchangeRate);
                    }
                    else
                    {
                        _date = _date.AddDays(-1);
                        if (_date.DayOfWeek == DayOfWeek.Saturday)
                            _date = _date.AddDays(-1);
                        if (_date.DayOfWeek == DayOfWeek.Sunday)
                            _date = _date.AddDays(-2);
                        Year = _date.ToString("yyyy");
                        Month = _date.ToString("MM");
                        Day = _date.ToString("dd");
                        Monthly = Year + Month;
                        AllDate = Day + Month + Year;
                        DateURL = Monthly + "/" + AllDate + ".xml";
                        exchangeRate = "https://www.tcmb.gov.tr/kurlar/";
                        exchangeRate += DateURL;
                    }
                }
            }
            else if(responseBank.StatusCode == HttpStatusCode.NotFound)
            {
                //merkez bankasına şuanda ulaşılamıyor!!
            }
            else
            {
                //merkez bankasından gelen Statuscode == responseBank.StatusCode
            }
            try
            {
                _usd = xmlDoc.SelectSingleNode("Tarih_Date/Currency[@Kod='USD']/ForexBuying").InnerXml;
                _eur = xmlDoc.SelectSingleNode("Tarih_Date/Currency[@Kod='EUR']/ForexBuying").InnerXml;
                _gbp = xmlDoc.SelectSingleNode("Tarih_Date/Currency[@Kod='GBP']/ForexBuying").InnerXml;
            }
            catch (NullReferenceException ex)
            {

                Console.WriteLine("\nError:\n"+ex.InnerException.Message);
            }



            var _foreignCurrency = new ExchangeRate()
            {
               DATE = _date.ToString("dd.MM.yyyy"),
               USD =_usd,
               EUR=_eur,
               GBP=_gbp
            };

            return _foreignCurrency;
        }
    }
}
