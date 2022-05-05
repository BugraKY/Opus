using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class Company
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Tax { get; set; }
    }
}
