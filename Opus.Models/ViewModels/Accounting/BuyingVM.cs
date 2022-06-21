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
        public PurchaseInvoice PurchaseInvoice { get; set; }
        public List<PurchaseInvoiceDetails> Enumerable_PurchaseInvoiceDetails { get; set; }
        public IEnumerable<PurchaseInvoice> Enumerable_PurchaseInvoice { get; set; }
        public IEnumerable<Identification> Identification_Enuberable { get; set; }
        public string CompanyId { get; set; }
        public Company Company { get; set; }
        public string IdentificationId { get; set; }
        public Identification Identification { get; set; }
        public int PaymentMethId { get; set; }
        public PaymentMeth PaymentMeth { get; set; }
        public IEnumerable<Category> Category_Enumerable { get; set; }
        public IEnumerable<SubCategory> SubCategory_Enumerable { get; set; }
        public IEnumerable<Tag> Tag_Enumerable { get; set; }
        public Category Category { get; set; }
        public SubCategory SubCategory { get; set; }
        public Tag Tag { get; set; }
        public bool Term15 { get; set; }
        public bool Term30 { get; set; }
        public bool Term45 { get; set; }
        public bool Term60 { get; set; }
        public bool Term90 { get; set; }
        public bool IsDiscount { get; set; }
    }
}
