using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class LocationInOut
    {
        [Key]
        public int Id { get; set; }
        public string StaffId { get; set; }
        public string LocationId { get; set; }
        public int InOutType { get; set; }//1:IN - 2:OUT
        public string Hour { get; set; }
        public int UserIntId { get; set; }
        public DateTime ProcessingDate { get; set; }
        public string Break { get; set; }
    }
}
