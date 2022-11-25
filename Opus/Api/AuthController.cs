using Opus.DataAcces.IMainRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Opus.Hubs;
using System.Security.Claims;
using Opus.Models.ViewModels;

namespace Opus.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        protected IHubContext<OpusHub> _context;
        public AuthController(IUnitOfWork uow, IHubContext<OpusHub> context)
        {
            _uow = uow;
            _context = context;
        }
        [HttpGet]
        [Route("check")]
        public async Task<bool> Authorized(bool auth)
        {
            await Task.Run(() =>
            {
                if (GetClaim().Value == null) auth = false;
                else auth = true;
            });
            return auth;
        }
        public Claim GetClaim()
        {
            var claimsIdentity = (ClaimsIdentity)User.Identity;
            var Claims = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier);
            if (Claims != null)
            {
                return Claims;
            }
            return null;
        }
        [HttpPost]
        [Route("user")]
        [AllowAnonymous]
        public SignInVM CheckUser(SignInVM form)
        {
            var test = form;
            return test;
        }
    }
}
