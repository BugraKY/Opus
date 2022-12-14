using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class StartOfShiftVM
    {
        public long[] Ids { get; set; }
        public long LocId { get; set; }
        public IEnumerable<Staff> Staff { get; set; }
        public IEnumerable<string> FullName { get; set; }
    }
}
