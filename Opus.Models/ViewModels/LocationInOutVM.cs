using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class LocationInOutVM:LocationInOut
    {
        public string Location { get; set; }
        public string DateStr { get; set; }
    }
}
