using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class StaffEquipmentVm
    {
        public int[] ProductId { get; set; }
        public int[] Quantity { get; set; }
        public DateTime[] DeliveryDate { get; set; }
        public DateTime[] ReturnDate { get; set; }
    }
}
