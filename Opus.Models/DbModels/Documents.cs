using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class Documents
    {
        [Key]
        public int Id { get; set; }
        public long StaffId { get; set; }
        public int DocumentTypeId { get; set; }
        public string FileName { get; set; }
        public bool Active { get; set; }
        public DateTime Created { get; set; }
    }
}
