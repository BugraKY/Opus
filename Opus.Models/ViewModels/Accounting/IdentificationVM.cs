using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class IdentificationVM
    {
        [ForeignKey("IdentificationTypeId")]
        public string IdentificationTypeId { get; set; }
        public IdentificationType IdentificationType { get; set; }// Tedarikçi - Müşteri ==> IdentificationType
        public string CommercialTitleId { get; set; }
        public CommercialTitle CommercialTitle { get; set; }// Ticari Ünvan
        public string StreetAddress { get; set; }// ???
        public string TaxAuthority { get; set; }
        public string TaxNo { get; set; }
        public string BankName { get; set; }
        public string IBAN { get; set; }
        public int PaymentTerm { get; set; }
        [ForeignKey("ContactId")]
        public string ContactId { get; set; }
        public Contact Contact { get; set; } //FULLName - Departmant - PhoneNum - Email
        [ForeignKey("CategoryId")]
        public string CategoryId { get; set; }
        public Category Category { get; set; } //Name ==>MainCategory
        [ForeignKey("SubCategoryId")]
        public string SubCategoryId { get; set; }
        public SubCategory SubCategory { get; set; } //Name - CategoryId
        [ForeignKey("LabCategoryId")]
        public string LabCategoryId { get; set; }
        public LabCategory LabCategory { get; set; } //Name - CategoryId - SubCategory

    }
}
