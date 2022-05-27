using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class TagsOfIdentification
    {
        [Key]
        public long Id { get; set; }
        [ForeignKey("TagId")]
        public string TagId { get; set; }
        [ForeignKey("IdentificationId")]
        public string IdentificationId { get; set; }
    }
}
