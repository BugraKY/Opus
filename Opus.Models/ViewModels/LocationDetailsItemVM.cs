using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class LocationDetailsItemVM
    {
        public long StaffId { get; set; }
        public long LocationInOutId { get; set; }
        public string FullName { get; set; }
        public int InOutType { get; set; }
        public string Hour { get; set; }
        public string DateStr { get; set; }
    }
}
