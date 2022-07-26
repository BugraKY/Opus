using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.ReferenceVerifDb
{
    public class Verifications
    {
        [Key]
        public Guid Id { get; set; }
        public string ReferenceCode { get; set; }
        public string ReferenceNum { get; set; }
        public bool Active { get; set; }
        public string ActiveSTR { get; set; }
        public Guid CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company Company { get; set; }
    }
}
