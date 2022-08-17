using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.ReferenceVerifLOG
{
    public class Input_LOG
    {
        [Key]
        public long Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Input_Company { get; set; }
        public string Input_Customer { get; set; }
        public string CompanyReference { get; set; }
        public string CustomerReference { get; set; }
        public DateTime Date { get; set; }
        public bool Success { get; set; }
        public bool Auth { get; set; }
        public bool Active { get; set; }
    }
}
