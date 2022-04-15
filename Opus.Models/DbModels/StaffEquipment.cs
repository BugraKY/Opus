using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class StaffEquipment
    {
        [Key]
        public int Id { get; set; }
        public int StaffId { get; set; }
        public long ProductId { get; set; }
        public int Quantity { get; set; }
        public DateTime DeliveryDate {get;set;}
        public DateTime ReturnDate { get; set; }
        [NotMapped]
        public Products Product { get; set; }
    }
}
