using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class PersonInfoVM
    {
        public string FullName { get; set; }
        public TimeKeeping TimeKeeping { get; set; }
        public IEnumerable<LocationInOutVM> LocationInOut { get; set; }

    }
}
