using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class Tag
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("CategoryId")]
        public Guid? CategoryId { get; set; }
        public Category Category { get; set; }
        [NotMapped]
        public string SubCategoryId { get; set; }
        [NotMapped]
        public bool AddAll { get; set; }
        [NotMapped]
        public Guid? TagDefinitionsId { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
    }
}
