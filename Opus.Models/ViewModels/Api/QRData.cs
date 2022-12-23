using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Api
{
    public class QRData
    {
        public string SerialNumber { get; set; }
        public string MaterialNumber { get; set; }
        public string ALCNumber { get; set; }
        public string OPNumber { get; set; }//StampNumber
        public bool AUTH { get; set; }
        public DateTime Date { get; set; }
    }
}
