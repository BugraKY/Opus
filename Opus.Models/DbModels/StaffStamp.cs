using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class StaffStamp
    {
        [Key]
        public int Id { get; set; }

        public long StaffId { get; set; }
        [ForeignKey("StaffId")]
        public Staff Staff { get; set; }

        public int StampId { get; set; }
        [ForeignKey("StampId")]
        public Stamp Stamp { get; set; }

        public DateTime IssueDate { get; set; }
        public DateTime CancelingDate { get; set; }
    }
}
