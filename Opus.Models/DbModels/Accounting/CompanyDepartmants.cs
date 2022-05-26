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
        [ForeignKey("DepartmantId")]
        public string DepartmantId { get; set; }
        public Departmant Departmant { get; set; }
        [ForeignKey("CompanyId")]
        public string CompanyId { get; set; }
        public Company Company { get; set; }
    }
}
