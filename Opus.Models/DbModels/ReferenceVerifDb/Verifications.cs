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
        public string CompanyReference { get; set; }
        public string CustomerReference { get; set; }
        public bool Active { get; set; }
        public Guid CustomerDefinitionsId { get; set; }
        [ForeignKey("CustomerDefinitionsId")]
        public CustomerDefinitions CustomerDefinitions { get; set; }
    }
}
