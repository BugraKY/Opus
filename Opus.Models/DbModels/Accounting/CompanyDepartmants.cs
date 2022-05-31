using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class CompanyDepartmants
    {
        [Key]
        public Guid Id { get; set; }
        public Guid DepartmantId { get; set; }
        [ForeignKey("DepartmantId")]
        public Departmant Departmant { get; set; }
        public Guid CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company Company { get; set; }
    }
}
