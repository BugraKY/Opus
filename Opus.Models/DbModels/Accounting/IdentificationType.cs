using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class IdentificationType
    {
        [Key]
        public Guid Id { get; set; }
        public string Identity { get; set; }//exm: supp-mp0005871
        public string Name { get; set; }//exm: Supplier - Customer
    }
}
