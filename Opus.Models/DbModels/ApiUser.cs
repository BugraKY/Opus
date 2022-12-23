using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class ApiUser
    {
        public long Id { get; set; }
        public long StaffId { get; set; }
        [ForeignKey("StaffId")]
        public Staff Staff { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string UserType { get; set; }
        public DateTime LastAction { get; set; }
    }
}
