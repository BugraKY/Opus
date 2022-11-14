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
        [Required(ErrorMessage = "The First Name field is required.")]
        public string AppFirstName { get; set; }
        [Required(ErrorMessage = "The Last Name field is required.")]
        public string AppLastName { get; set; }
        [Required(ErrorMessage = "The Password field is required.")]
        public string AppPass { get; set; }
        [Required(ErrorMessage = "The Email field is required.")]
        [Display(Name = "Mail")]
        public string AppMail { get; set; }
        public string AddRole { get; set; }
        public string RoleString { get; set; }
        public IdentityRole SelectedRole { get; set; }
        public IQueryable<string> IdentityRole { get; set; }
        public IQueryable<IdentityRole> Roles { get; set; }
        public IEnumerable<ApplicationUser> ApplicationUsersEnumeralbe { get; set; }
    }
}
