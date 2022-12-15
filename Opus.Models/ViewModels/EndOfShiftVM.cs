using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class EndOfShiftVM
    {
        public long[] Ids { get; set; }
        /*status.endoftime = endoftime;
                status.mealtime = mealtime;*/

        public string Endoftime { get; set; }
        public string Mealtime { get; set; }
        public IEnumerable<LocationInOut> LocationInOuts { get; set; }
        public IEnumerable<TimeKeeping> TimeKeepings { get; set; }
        /*
        public long LocationInOutId { get; set; }
        public string FullName { get; set; }
        public string Date { get; set; }
        public string InTime { get; set; }*/
    }
}
