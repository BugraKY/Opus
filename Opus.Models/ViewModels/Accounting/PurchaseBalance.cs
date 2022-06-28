using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class PurchaseBalance
    {
        public Guid Id { get; set; }
        public bool Active { get; set; }
        public long IdNumber { get; set; }
        public string IdentityCode { get; set; }
        public string CommercialTitle { get; set; }
        public int PaymentTerm { get; set; }
        public int NumberOfInvoices { get; set; }
        public float Balance_TRY { get; set; }
        public float Balance_USD { get; set; }
        public float Balance_EUR { get; set; }
    }
}
