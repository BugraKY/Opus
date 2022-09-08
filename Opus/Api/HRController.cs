using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Opus.DataAcces.IMainRepository;
using Opus.Hubs;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using System.Collections.Generic;
using System.Text;
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
        [HttpGet()]
        [Route("list-training")]
        public async Task<IEnumerable<Training>> GetListTraining()
        {
            return await Task.Run(() =>
            {
                return _uow.Training.GetAll(includeProperties: "Location").OrderBy(s => s.Subject);
            });
            //return null;
        }
        [HttpPost()]
        [Route("get-reference-locid/{locationid}")]
        public async Task<IEnumerable<References>> GetReferenceBylocid(long locationid)
        {
            return await Task.Run(() =>
            {
                return _uow.References.GetAll(i => i.LocationId == locationid, includeProperties: "Location");
            });
            //return null;
        }
        [HttpGet()]
        [Route("get-references")]
        public async Task<IEnumerable<References>> GetReferences()
        {
            return await Task.Run(() =>
            {
                return _uow.References.GetAll(includeProperties: "Location,Company");
            });
            //return null;
        }
        [HttpGet()]
        [Route("get-companies/{id}")]
        public async Task<IEnumerable<Company>> GetCompanies(long id)
        {
            return await Task.Run(() =>
            {
                return _uow.Company.GetAll(i => i.LocationId == id, includeProperties: "Location");
            });
            //return null;
        }
        [HttpGet()]
        [Route("get-companies-all")]
        public async Task<IEnumerable<Company>> GetCompaniesAll()
        {
            return await Task.Run(() =>
            {
                return _uow.Company.GetAll(includeProperties: "Location");
            });
            //return null;
        }
        [HttpPost()]
        [Route("add-trainer")]
        public async Task<ToastMessageVM> AddTrainer([FromBody] Trainer _trainer)
        {
            var trainer = _uow.Trainer.GetAll(i => i.FullName == _trainer.FullName, includeProperties: "Location").OrderBy(n => n.FullName).Count();

            if (trainer == 0)
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
                    catch (Exception ex)
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

        [HttpPost()]
        [Route("add-Reference")]
        public async Task<ToastMessageVM> AddReference([FromBody] References _reference)
        {
            var reference = _uow.References.GetAll(i => i.Reference == _reference.Reference).Count();

            if (reference == 0)
            {
                return await Task.Run(() =>
                {
                    try
                    {
                        _uow.References.Add(_reference);
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
                    catch (Exception ex)
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
        [HttpPost()]
        [Route("staff-user-add")]
        public async Task<IEnumerable<Staff>> AddStaffUserPost([FromBody]Staff user)
        {

            return await Task.Run(() =>
            {
                var _staff = _uow.Staff.GetFirstOrDefault(i=>i.Id==user.Id);
                if (_staff != null)
                {
                    _staff.Auth = user.Auth;
                    _staff.AppUser = user.AppUser;
                    _staff.AppPassword = user.AppPassword;
                    _staff.IsUser = true;
                }
                _uow.Staff.Update(_staff);
                _uow.Save();
                return _uow.Staff.GetAll().Where(a => (a.Active && a.Status == 1 && a.IsUser));
            });
        }
        [HttpGet()]
        [Route("staff-user-added")]
        public async Task<IEnumerable<Staff>> GetAddedStaffUser()
        {
            return await Task.Run(() =>
            {
                return _uow.Staff.GetAll().Where(a => (a.Active && a.Status == 1 && a.IsUser));
            });
        }
        [HttpGet()]
        [Route("staff-user-non-added")]
        public async Task<IEnumerable<Staff>> GetNonAddedStaffUser()
        {
            return await Task.Run(() =>
            {
                return _uow.Staff.GetAll().Where(a => (a.Active && a.Status == 1 && a.IsUser==false)).
                OrderBy(n=>n.FirstName);
            });
        }
        [HttpPost()]
        [Route("generate-pass")]
        public string GeneratePassword([FromBody] string key)
        {
            var length = 6;
            StringBuilder res = new StringBuilder();
            /*
            var _password = "";
            if (key == "vasd7564as52d9c7s")
            {
                _password = Guid.NewGuid().ToString().Replace("-", "").Substring(1,6);
            }
            return _password;
            */
            if (key == "vasd7564as52d9c7s")
            {
                const string valid = "abcdefghijkmnopqrstuvwxyz1234567890";

                Random rnd = new Random();
                while (0 < length--)
                {
                    res.Append(valid[rnd.Next(valid.Length)]);
                }

            }
            return res.ToString();
        }
        [HttpPost()]
        [Route("generate-username")]
        public string GenerateUserName([FromBody] string FullName)
        {
            var multiwords = FullName.ToLower().Replace('ı', 'i').Replace('ğ', 'g').Replace('ü', 'u').Replace('ş', 's').Replace('ö', 'o').Replace('ç', 'c').Replace(' ','.').Split('.');
            return multiwords.First() +"."+ multiwords.Last();
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
