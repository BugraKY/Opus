using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class ContactDefinitions
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("ContactId")]
        public string ContactId { get; set; }
        [ForeignKey("IdentificationId")]
        public string IdentificationId { get; set; }

    }
}
