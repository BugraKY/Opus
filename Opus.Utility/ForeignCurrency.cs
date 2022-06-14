using Opus.Models.ViewModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public ExchangeRate GetExchangeByDate(DateTime _date)
        {
            _date=_date.AddDays(-1);
            var Year = _date.ToString("yyyy");
            var Month = _date.ToString("MM");
            var Day = _date.ToString("dd");
            var Monthly = Year + Month;
            var AllDate = Day + Month + Year;
            var DateURL = Monthly + "/" + AllDate + ".xml";
            exchangeRate += DateURL;

            var xmlDoc = new XmlDocument();
            xmlDoc.Load(exchangeRate);

            string _usd = xmlDoc.SelectSingleNode("Tarih_Date/Currency[@Kod='USD']/ForexBuying").InnerXml;
            string _eur = xmlDoc.SelectSingleNode("Tarih_Date/Currency[@Kod='EUR']/ForexBuying").InnerXml;
            string _gbp = xmlDoc.SelectSingleNode("Tarih_Date/Currency[@Kod='GBP']/ForexBuying").InnerXml;

            var _foreignCurrency = new ExchangeRate()
            {
               USD=_usd,
               EUR=_eur,
               GBP=_gbp
            };

            return _foreignCurrency;
        }
    }
}
