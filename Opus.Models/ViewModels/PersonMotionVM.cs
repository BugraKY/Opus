using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class PersonMotionVM
    {
        public StaffStamp StaffStamp { get; set; }
        public TimeKeeping TimeKeeping { get; set; }
        public LocationInOut LocationInOut { get; set; }
        public string Today { get; set; }
    }
}
