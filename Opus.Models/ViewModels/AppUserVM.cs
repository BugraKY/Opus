using Microsoft.AspNetCore.Identity;
using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class AppUserVM
    {
        public string Id { get; set; }
        [Required]
        public string AppFirstName { get; set; }
        [Required]
        public string AppLastName { get; set; }
        [Required]
        public string AppPass { get; set; }
        [Required]
        public string AppMail { get; set; }
        [Required]
        public string AddRole { get; set; }
        public string RoleString { get; set; }
        public IdentityRole SelectedRole { get; set; }
        public IQueryable<string> IdentityRole { get; set; }
        public IEnumerable<ApplicationUser> ApplicationUsersEnumeralbe { get; set; }
    }
}
