using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Opus.DataAcces.IMainRepository;
using Opus.Hubs;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using static Opus.Utility.ProjectConstant;

namespace Opus.Api
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/hr")]

    public class HRController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        protected IHubContext<OpusHub> _context;
        public HRController(IUnitOfWork uow, IHubContext<OpusHub> context)
        {
            _uow = uow;
            _context = context;
        }
        [HttpPost()]
        [Route("get-staff-active")]
        public async Task<IEnumerable<Staff>> GetStaffActive()
        {
            return await Task.Run(() =>
            {
                return _uow.Staff.GetAll().OrderBy(n => n.FirstName).Where(i => (i.Active && i.Status == 1));
            });
            //return null;
        }
        [HttpPost()]
        [Route("get-location")]
        public async Task<IEnumerable<Location>> GetLocation()
        {
            return await Task.Run(() =>
            {
                return _uow.Location.GetAll().OrderBy(n => n.Name).Where(i => (i.Active));
            });
            //return null;
        }
        [HttpPost()]
        [Route("get-trainer")]
        public async Task<IEnumerable<Trainer>> GetTrainer()
        {
            return await Task.Run(() =>
            {
                return _uow.Trainer.GetAll(includeProperties: "Location").OrderBy(n => n.FullName);
            });
            //return null;
        }
        [HttpPost()]
        [Route("add-trainer")]
        public async Task<ToastMessageVM> AddTrainer([FromBody] Trainer _trainer)
        {
            var trainer = _uow.Trainer.GetAll(i => i.FullName == _trainer.FullName, includeProperties: "Location").OrderBy(n => n.FullName).Count();
            
            if(trainer == 0)
            {
                return await Task.Run(() =>
                {
                    try
                    {
                        _uow.Trainer.Add(_trainer);
                        _uow.Save();
                        var _toast = new ToastMessageVM()
                        {
                            Message = "success",
                            Header = "Status",
                            Icon = "Success",
                            HideAfter = 0
                        };
                        return _toast;
                    }
                    catch(Exception ex)
                    {
                        var _toast = new ToastMessageVM()
                        {
                            Message = ex.Message,
                            Header = "Fail",
                            Icon = "danger",
                            HideAfter = 0
                        };
                        return _toast;
                    }

                });
            }
            
            var _toast = new ToastMessageVM()
            {
                Message = "This trainer already added before",
                Header = "Status",
                Icon = "warning",
                HideAfter = 0
            };
            return _toast;

            //return null;
        }

        /*
        [HttpPost()]
        [Route("remove-trainer")]
        public async Task<ToastMessageVM> RemoveTrainer(string id)
        {
            var _trainer = _uow.Trainer.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
        }*/
    }
}
