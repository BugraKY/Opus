using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class BuyingDetails
    {
        //buyinginp id -- foreignkey
        public Tag Tag { get; set; }
        [ForeignKey("TagId")]
        public Guid TagId { get; set; }
        public int Piece { get; set; }
        public float Price { get; set; }
        public float Vat_Rate { get; set; }
        public float Vat { get; set; }
        public float Discount_Rate { get; set; }
        public float Discount { get; set; }
        public float Total { get; set; }
    }
}
