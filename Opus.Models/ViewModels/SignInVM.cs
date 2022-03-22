using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class SignInVM
    {

        [Required(ErrorMessage = "Kullanıcı adı alanı zorunludur.")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Şifre alanı zorunludur.")]
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }
}
