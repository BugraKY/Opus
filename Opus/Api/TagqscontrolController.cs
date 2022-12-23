using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Opus.DataAcces.IMainRepository;
using Opus.Hubs;
using Opus.Models.ViewModels.Api;
using System.Text.Json;

namespace Opus.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagqscontrolController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        protected IHubContext<OpusHub> _context;
        public TagqscontrolController(IUnitOfWork uow, IHubContext<OpusHub> context)
        {
            _uow = uow;
            _context = context;
        }
        [HttpPost]
        [Route("get")]
        [AllowAnonymous]
        public string Get([FromBody] QRData data)
        {
            var _DateTime= DateTime.Now;
            var jsondata = new QRData
            {
                SerialNumber = data.SerialNumber,
                MaterialNumber = data.MaterialNumber,
                ALCNumber = data.ALCNumber,
                Date= _DateTime,
                AUTH = true,
            };
            return JsonSerializer.Serialize(jsondata);
        }
        [HttpPost]
        [Route("signin")]
        [AllowAnonymous]
        public string SignIn([FromBody] TagQsControlUser data)
        {
            if (!string.IsNullOrEmpty(data.UserName) && (!string.IsNullOrEmpty(data.Password)))
            {
                string _StaffStamp = "EX-0";
                var _getdata = _uow.ApiUser.GetFirstOrDefault(i => (i.UserName == data.UserName && i.Password == data.Password));
                if (_getdata == null)
                    data.UserNotFound = true;
                else
                {
                    var _DATETIMENOW = DateTime.Now;

                    //data.StampNumber = _uow.StaffStamp.GetFirstOrDefault(i => i.StaffId == _getdata.StaffId).Stamp.StampNumber;
                    var staffStamp = _uow.StaffStamp.GetFirstOrDefault(i => (i.StaffId == _getdata.StaffId && i.Stamp.Lost == 0 && i.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000")), includeProperties: "Stamp");
                    if (staffStamp != null)
                        _StaffStamp = staffStamp.Stamp.StampNumber;

                    data = new TagQsControlUser
                    {
                        UserName = data.UserName,
                        Password = data.Password,
                        StampNumber = _StaffStamp,
                        LastAction = _DATETIMENOW,
                        Status = true
                    };

                    _getdata.LastAction = _DATETIMENOW;
                    _uow.ApiUser.Update(_getdata);
                    _uow.Save();
                    if (_getdata == null)
                    {
                        data.Status = true;
                        data.UserNotFound = false;
                    }
                }
            }
            else
            {
                data.UserNotFound = true;
                data.Logged = false;
                data.Status = false;
            }
            return JsonSerializer.Serialize(data);
        }
    }
}
