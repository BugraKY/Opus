using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Api
{
    public class TagQsControlUser
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool Status { get; set; }
        public string StampNumber { get; set; }
        public DateTime LastAction { get; set; }
        public bool Logged { get; set; }
        public bool UserNotFound { get; set; }
    }
}
