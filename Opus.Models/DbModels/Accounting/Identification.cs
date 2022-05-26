using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class Identification
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("IdentificationTypeId")]
        public string IdentificationTypeId { get; set; }
        public string CommercialTitleId { get; set; }
        public string StreetAddress { get; set; }// ???
        public string TaxAuthority { get; set; }
        public string TaxNo { get; set; }
        public string BankName { get; set; }
        public string IBAN { get; set; }
        public bool PaymentTerm30 { get; set; }
        public bool PaymentTerm60 { get; set; }
        public bool PaymentTerm90 { get; set; }
    }
}
