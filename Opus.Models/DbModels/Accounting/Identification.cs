using System;
using System.Collections.Generic;
using System.ComponentModel;
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

        public Guid IdentificationTypeId { get; set; }
        [ForeignKey("IdentificationTypeId")]
        public IdentificationType IdentificationType { get; set; }
        public string IdentityCode { get; set; }//exm: supp-mp0005871
        [DefaultValue(0)]
        public long IdNumber { get; set; }
        public Guid CommercialTitleId { get; set; }
        [ForeignKey("CommercialTitleId")]
        public CommercialTitle CommercialTitle { get; set; }
        public Guid? CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company Company { get; set; }
        public string StreetAddress { get; set; }// ???
        public string TaxAuthority { get; set; }
        public string TaxNo { get; set; }
        public Guid BankId { get; set; }
        [ForeignKey("BankId")]
        public Bank Bank { get; set; }
        public string IBAN { get; set; }
        public bool PaymentTerm30 { get; set; }
        public bool PaymentTerm60 { get; set; }
        public bool PaymentTerm90 { get; set; }
    }
}
