using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class Contact
    {
        [Key]
        public Guid Id { get; set; }
        public string FullName { get; set; }
        [ForeignKey("DepartmantId")]
        public string DepartmantId { get; set; }
        public Departmant Departmant { get; set; }
        public string MobileNumber { get; set; }
        public string Email { get; set; }
    }
}
