using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class ApplicationUser : IdentityUser
    {
        public int IntId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AppUserName { get; set; }
        public string IdentityNumber { get; set; }
        public string UserRole { get; set; }
        public bool Active { get; set; }
    }
}
