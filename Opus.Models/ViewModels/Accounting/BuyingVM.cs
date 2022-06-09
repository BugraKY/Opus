using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class BuyingVM
    {
        public BuyingInput BuyingInput { get; set; }
        public IEnumerable<Identification> Identification_Enuberable { get; set; }
        public string CompanyId { get; set; }
        public Company Company { get; set; }
        public string IdentificationId { get; set; }
        public Identification Identification { get; set; }
        public int PaymentMethId { get; set; }
        public PaymentMeth PaymentMeth { get; set; }
    }
}
