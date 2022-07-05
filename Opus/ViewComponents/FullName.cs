using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using System.Security.Claims;

namespace Opus.ViewComponents
{
    public class FullName : ViewComponent
    {
        private readonly IUnitOfWork _uow;
        public FullName(IUnitOfWork uow)
        {
            _uow = uow;
        }
        public IViewComponentResult Invoke()
        {
            var _user = _uow.ApplicationUser.GetFirstOrDefault(i => i.Id == GetClaim().Value);
            var FullName = _user.FirstName + " " + _user.LastName;
            return View("default", FullName);
            //return View();
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
    }
}
