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
        public string Name { get; set; }
        [ForeignKey("CategoryId")]
        public string CategoryId { get; set; }
        public Category Category { get; set; }
        [ForeignKey("SubCategoryId")]
        public string SubCategoryId { get; set; }
        public SubCategory SubCategory { get; set; }
        public bool Active { get; set; }
    }
}
