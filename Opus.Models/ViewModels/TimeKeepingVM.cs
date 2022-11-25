using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class TimeKeepingVM
    {
        public int Sequance { get; set; }
        public TimeKeeping TimeKeeping { get; set; }
        public Staff Staff { get; set; }
    }
}
