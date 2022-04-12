using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class ChecksVM
    {
        public Guid Guid { get; set; }
        public bool Checked { get; set; } = false;
    }
}
