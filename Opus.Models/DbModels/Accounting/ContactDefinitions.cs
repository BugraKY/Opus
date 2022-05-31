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
        public Guid ContactId { get; set; }
        [ForeignKey("ContactId")]
        public Contact Contact { get; set; }
        public Guid IdentificationId { get; set; }
        [ForeignKey("IdentificationId")]
        public Identification Identification { get; set; }
    }
}
