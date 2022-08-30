using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.ReferenceVerifDb
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public long StaffId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool Admin { get; set; }
        public bool Active { get; set; }
        [NotMapped]
        public string FullName { get; set; }
    }
}
