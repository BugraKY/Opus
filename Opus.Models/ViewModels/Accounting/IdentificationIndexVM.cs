using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class IdentificationIndexVM : Identification
    {
        public string CompanyId { get; set; }
        public Company CompanyItem { get; set; }
        public IEnumerable<Company> Companies { get; set; }
        public List<Contact> ContactEnumerable { get; set; }
        public IEnumerable<IdentificationType> IdentificationType_Enumerable { get; set; }
        public IEnumerable<Bank> Bank_Enumerable { get; set; }
        public IEnumerable<Departmant> Departmant_Enumerable { get; set; }
        public List<Identification> Identification_Enumerable { get; set; }
        public Identification Identification_Item { get; set; }
        public bool Term15 { get; set; }
        public bool Term30 { get; set; }
        public bool Term45 { get; set; }
        public bool Term60 { get; set; }
        public bool Term90 { get; set; }
        public float Balance_TRY_Total { get; set; }
        public float Balance_USD_Total { get; set; }
        public float Balance_EUR_Total { get; set; }

    }
}
