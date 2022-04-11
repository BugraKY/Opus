using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;

namespace Opus.ViewComponents
{
    public class StaffCard : ViewComponent
    {
        private readonly IUnitOfWork _uow;
        public StaffCard(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public IViewComponentResult Invoke()
        {
            var _staff = _uow.Staff.GetAll();
            return View("default", _staff);
        }
    }
}
