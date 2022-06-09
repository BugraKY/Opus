using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class BuyingInput
    {
        public string IdentificationId { get; set; }
        [Required]
        public DateTime DocDate { get; set; }

        [Required]
        [MaxLength(20,ErrorMessage ="This field cannot be more than 20 characters.")]
        public string DocNo { get; set; }
        public int PaymentMethId { get; set; }


    }
}
