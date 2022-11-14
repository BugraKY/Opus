using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class UserVM : ApplicationUser
    {
        public IList<string> UserRoles { get; set; }
        public string CurrentPasswd { get; set; }
        public string NewPasswd { get; set; }
        public string VerifyNewPasswd { get; set; }
    }
}
