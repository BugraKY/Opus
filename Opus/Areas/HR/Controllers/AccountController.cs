﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IUnitOfWork _uow;
        private readonly ILogger<AccountController> _logger;
        public AccountController(UserManager<ApplicationUser> userManager,SignInManager<ApplicationUser> signInManager,IUnitOfWork uow, ILogger<AccountController> logger)
        {
            _userManager=userManager;
            _signInManager=signInManager;
            _uow=uow;
            _logger=logger;
        }
        public IActionResult Index()
        {
            return View();
        }
        [Route("signin")]
        public IActionResult SignIn()
        {
            return View();
        }
        [HttpPost("signin")]
        public async Task<IActionResult> SignInAsync(SignInVM Input)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(Input.Email, Input.Password, Input.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var user = _uow.ApplicationUser.GetFirstOrDefault(u => u.Email == Input.Email);
                    _logger.LogInformation("Kullanıcı giriş yaptı." + "Kullanıcı: " + user.Email);

                    return LocalRedirect("/");
                }
                if (result.ToString() == "Failed")
                {
                    _logger.LogInformation("Kullanıcı bilgisi doğru değil. - Girilen Email :" + Input.Email);
                    //ModelState.AddModelError(string.Empty, "Kullanıcı bilgisi yalnış. Lütfen bilgilerinizi kontrol ediniz.");
                    ModelState.AddModelError(string.Empty, "Giriş bilgilerinden E-posta veya Şifre doğru değil. Lütfen bilgilerinizi kontrol ediniz.");
                    return View("SignIn");
                }
                if (result.IsNotAllowed)
                {
                    _logger.LogInformation("Onaylanmamış Hesaba giriş denemesi:" + Input.Email);
                    ModelState.AddModelError(string.Empty, "Hesabınız pasif durumunda.");
                    return View("Index");
                }/*
                if (result.RequiresTwoFactor)
                {
                    return RedirectToPage("./LoginWith2fa", new { ReturnUrl = returnUrl, RememberMe = Input.RememberMe });
                }*/
                if (result.IsLockedOut)
                {
                    _logger.LogWarning("Kullanıcı hesabı kilitlendi!");
                    return RedirectToPage("./Lockout");
                }
                else
                {
                    _logger.LogInformation("Kullanıcıgirişinde bilinmeyen bir hata:" + Input.Email);
                    ModelState.AddModelError(string.Empty, "Kullanıcı girişinde bilinmeyen bir hata. ");
                    return View("Index");
                    //return Page();
                }
            }

            //_logger.LogInformation("Error: 'ModelState Invalid' - Girilen Email :" + Input.Email);
            //ModelState.AddModelError(string.Empty, "Kullanıcı bilgisi yalnış. Lütfen bilgilerinizi kontrol ediniz.");
            //ModelState.AddModelError(string.Empty, "Giriş bilgilerinden E-posta veya Şifre doğru değil. Lütfen bilgilerinizi kontrol ediniz.");
            return View("SignIn");
        }
        [Route("signup")]
        public IActionResult SignUp()
        {
            return View();
        }
        [Route("logout")]
        public async Task<IActionResult> LogOut()
        {
            await _signInManager.SignOutAsync();
            return Redirect("/");
        }
        /*
        [HttpPost]
        public IActionResult SignUp()
        {
            return View();
        }*/
    }
}