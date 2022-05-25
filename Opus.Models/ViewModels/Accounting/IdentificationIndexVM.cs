using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class IdentificationIndexVM : IdentificationVM
    {
        public Company CompanyItem { get; set; }
        public IEnumerable<Company> Companies { get; set; }
        public IList<Contact> ContactEnumerable { get; set; }

    }
}
