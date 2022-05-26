using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class SubCategory
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        [ForeignKey("CategoryId")]
        public string CategoryId { get; set; }
        public bool Active { get; set; }
    }
}
