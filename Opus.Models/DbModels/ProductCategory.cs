using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class ProductCategory
    {
        [Key]
        public int Id { get; set; }
        public int Type { get; set; }
        public string Name { get; set; }
        public bool IsDeleted { get; set; }
    }
}
