using Newtonsoft.Json;
using Opus.Models.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Extensions
{
    public class ValidateBank
    {
        protected IWebHostEnvironment _hostEnvironment;//wwwroot konum olarak erişim sağlar. Yani host dosyamızın ana dosyasına erişilir.
        public ValidateBank(IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
        }
        public BankCodesVM Validate(int bankCode)
        {
            var rootPath = _hostEnvironment.ContentRootPath;
            var fullPath = Path.Combine(rootPath, @"wwwroot\assets\banks\bankcodes.json");
            var jsonBytes = System.IO.File.ReadAllBytes(fullPath); 
            string jsonData = Encoding.Latin1.GetString(jsonBytes);
            if (string.IsNullOrWhiteSpace(jsonData)) 
                return null;
            var _bankcodes=JsonConvert.DeserializeObject<IEnumerable<BankCodesVM>>(jsonData);
            var bank=_bankcodes.FirstOrDefault(i=>i.BankCode== bankCode);
            if (bank != null)
                return bank;
            else
                return null;
        }
    }
}
