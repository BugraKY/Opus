using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class ToastMessageVM
    {
        public string Header { get; set; }
        public string Message { get; set; }
        public int HideAfter { get; set; }
        public string Icon { get; set; }
        public string ShowHideTransition { get; set; }

    }
}
