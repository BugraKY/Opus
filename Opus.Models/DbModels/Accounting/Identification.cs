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
        public string CommercialTitle { get; set; }
        public Guid CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company Company { get; set; }
        public string StreetAddress { get; set; }// ???
        public string TaxAuthority { get; set; }
        public string TaxNo { get; set; }
        public Guid BankId { get; set; }
        [ForeignKey("BankId")]
        public Bank Bank { get; set; }
        public string IBAN { get; set; }
        public int PaymentTerm { get; set; }
        public bool Active { get; set; }
        [NotMapped]
        public float Balance_TRY { get; set; }
        [NotMapped]
        public float Balance_USD { get; set; }
        [NotMapped]
        public float Balance_EUR { get; set; }
        [NotMapped]
        public List<PurchaseInvoice> PurchaseInvoices { get; set; }
        [NotMapped]
        public int NumberOfInvoices { get; set; }

    }
}
