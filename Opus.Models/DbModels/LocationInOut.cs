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
        public long Id { get; set; }
        public long StaffId { get; set; }//UserId
        public long LocationId { get; set; }// LokasyonId
        public int InOutType { get; set; }//1:IN - 2:OUT
        public string Hour { get; set; }//Saat
        public int UserIntId { get; set; }
        public DateTime ProcessingDate { get; set; }//İslemTarihi
        public string Break { get; set; }//Mola
        public  bool IsDeleted { get; set; }
    }
}
