using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class StatusOfStaffVM
    {
        public int Active { get; set; }
        public int Passive { get; set; }
        public int Exit { get; set; }
        public int All {get; set; }
    }
}
