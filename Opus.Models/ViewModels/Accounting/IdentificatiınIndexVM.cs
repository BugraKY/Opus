using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class IdentificatiınIndexVM
    {
        public Company CompanyItem { get; set; }
        public IEnumerable<Company> Companies { get; set; }

    }
}
