using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class Invoice_Buying
    {
        [Key]
        public Guid Id { get; set; }


        [ForeignKey("IdentificationId")]
        public string IdentificationId { get; set; }
        public Identification Identification { get; set; }


        [ForeignKey("CompanyId")]
        public string CompanyId { get; set; }
        public Company Company { get; set; }


        [ForeignKey("PaymentMethId")]
        public int PaymentMethId { get; set; }
        public PaymentMeth PaymentMeth { get; set; }


        public DateTime? PaymentTerm { get; set; }



    }
}
