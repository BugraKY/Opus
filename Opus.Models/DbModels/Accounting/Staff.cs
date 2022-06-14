using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class Staff
    {
        [Key]
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MobileNum { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }
        public Guid CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company Company { get; set; }
        public Guid DepartmantId { get; set; }
        [ForeignKey("DepartmantId")]
        public Departmant Departmant { get; set; }
    }
}
