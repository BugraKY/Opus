using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class PurchaseInvoiceDetails
    {
        [Key]
        public long Id { get; set; }
        public Guid PurchaseInvoiceId { get; set; }
        [ForeignKey("PurchaseInvoiceId")]
        public PurchaseInvoice PurchaseInvoice { get; set; }
        public TagDefinitions TagDefinitions { get; set; }
        [ForeignKey("TagDefinitionsId")]
        public Guid TagDefinitionsId { get; set; }
        public int Piece { get; set; }
        public float Price { get; set; }
        public float Vat_Rate { get; set; }
        public float Vat { get; set; }
        //public float Discount_Rate { get; set; }
        public float Discount { get; set; }
        public float Total { get; set; }
        //developing
    }
}
