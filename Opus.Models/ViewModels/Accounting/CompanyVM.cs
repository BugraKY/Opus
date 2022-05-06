using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class CompanyVM
    {
        public string Name { get; set; }
        public string TaxNo { get; set; }
        public string TaxAuthority { get; set; }
        public string ImageFileStr { get; set; }
        public IFormFile ImageFile { get; set; }
        public string Description { get; set; }
    }
}
