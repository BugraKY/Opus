using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IronOcr;
using Microsoft.AspNetCore.Authorization;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels.ReferenceVerifDb;
using System.Text.Json;
using Opus.Models.DbModels.ReferenceVerifLOG;
using Microsoft.EntityFrameworkCore;
using Opus.Extensions;
using Microsoft.AspNetCore.SignalR;
using Opus.Hubs;
using Newtonsoft.Json.Linq;
using Opus.Utility;

namespace Opus.Api
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/rv")]
    public class RVQController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        protected IHubContext<OpusHub> _context;
        public RVQController(IUnitOfWork uow, IHubContext<OpusHub> context)
        {
            _uow = uow;
            _context = context;
        }
        [HttpGet()]
        [Route("query-reference/{value}/user/{id}")]
        public async Task<string> GetByBarcode(string value, string id)
        {
            Verifications _verification = new Verifications();
            Verifications _verificationNULL = new Verifications();
            ReferenceDefinitions _def = new ReferenceDefinitions();
            var _json = "";
            await Task.Run(() =>
            {
                /*
                var _user = _uow.ReferenceVerif_User.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
                var _refNum = _uow.ReferenceVerif_Verification.GetFirstOrDefault(v => v.CustomerReference == value, includeProperties: "Company");
                if (_refNum == null)
                {
                    _verification = _uow.ReferenceVerif_Verification.GetFirstOrDefault(v => v.CompanyReference == value, includeProperties: "Company");
                    if( _verification != null)
                    {
                        _def = _uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(v => (v.VerificationsId == _verification.Id && v.UserId == Guid.Parse(id)),
                            includeProperties: "Verifications");
                    }
                }
                else
                {
                    //_verification = _refNum;
                    if (_user.Admin)
                    {
                        _def = new ReferenceDefinitions
                        {
                            Verifications=_refNum
                        };
                    }
                    else
                    {
                        _def = _uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(v => (v.VerificationsId == _refNum.Id && v.UserId == Guid.Parse(id)),
                            includeProperties: "Verifications");
                    }

                }
                */

            });


            //TEST
            var auth = true;
            var currenVal = value.Remove(0, 1);
            var _user = _uow.ReferenceVerif_User.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
            var _refNum = _uow.ReferenceVerif_Verification.GetFirstOrDefault(v => v.CompanyReference == currenVal, includeProperties: "CustomerDefinitions.Customer.Company,CustomerDefinitions.Company");
            if (_refNum == null)
            {
                _verification = _uow.ReferenceVerif_Verification.GetFirstOrDefault(v => v.CustomerReference == currenVal, includeProperties: "CustomerDefinitions.Customer.Company,CustomerDefinitions.Company");
                if (_verification != null)
                {
                    _def = _uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(v => (v.VerificationsId == _verification.Id && v.UserId == Guid.Parse(id)),
                        includeProperties: "Verifications");
                }
            }
            else
            {
                //_verification = _refNum;
                if (_user.Admin)
                {
                    _def = new ReferenceDefinitions
                    {
                        Verifications = _refNum
                    };
                }
                else
                {
                    _def = _uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(v => (v.VerificationsId == _refNum.Id && v.UserId == Guid.Parse(id)),
                        includeProperties: "Verifications");

                    if (_def == null)
                        auth = false;

                }

            }
            //TEST

            if (_def != null)
                _json = JsonSerializer.Serialize(_def.Verifications);
            else
                _json = JsonSerializer.Serialize(_verificationNULL);


            bool _success = false;
            Scanner_LOG _LOG = null;

            if (_def == null)
            {
                //var _noverify = _uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(v => v.VerificationsId == _refNum.Id, includeProperties: "Verifications");
                _LOG = new Scanner_LOG()
                {
                    BarcodeNum = value,
                    CompanyReference = _refNum.CompanyReference,
                    CustomerReference = _refNum.CustomerReference,
                    UserId = _user.Id,
                    UserName = _user.UserName,
                    //FullName = _user.FullName,
                    FullName = _user.Staff.FirstName + " "+_user.Staff.LastName,
                    Date = DateTime.Now,
                    Success = true,
                    Auth = auth,
                    Active = _refNum.Active
                };
            }
            else
            {
                if (_def.Verifications == null)
                {
                    _LOG = new Scanner_LOG()
                    {
                        BarcodeNum = value,
                        CompanyReference = "",
                        CustomerReference = "",
                        UserId = _user.Id,
                        UserName = _user.UserName,
                        //FullName = _user.FullName,
                        FullName = _user.Staff.FirstName + " " + _user.Staff.LastName,
                        Date = DateTime.Now,
                        Success = _success,
                        Auth = auth,
                        Active = false
                    };
                }
                else
                {
                    if (_def.Verifications.CustomerReference != null)
                        _success = true;

                    _LOG = new Scanner_LOG()
                    {
                        BarcodeNum = value,
                        CompanyReference = _def.Verifications.CompanyReference,
                        CustomerReference = _def.Verifications.CustomerReference,
                        UserId = _user.Id,
                        UserName = _user.UserName,
                        //FullName = _user.FullName,
                        FullName = _user.Staff.FirstName + " " + _user.Staff.LastName,
                        Date = DateTime.Now,
                        Success = _success,
                        Auth = auth,
                        Active = _def.Verifications.Active
                    };
                }
            }

            try
            {
                _uow.ReferenceVerif_Scanner_LOG.Add(_LOG);
                _uow.Save();
                WebSocketAction WebSocAct = new WebSocketAction(_context, _uow);
                await WebSocAct.JqueryTrigger_WebSocket();

                var _auth = _LOG.Auth;
                var _successs = _LOG.Success;
                var _type = 0;

                if (_auth)
                {
                    if (_success)
                        _type = 4;
                    else
                        _type = 2;
                }
                else
                    _type=1;



                //await WebSocAct.JqueryNotify(Notifications.SetHtmlRefs(_type));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
            }

            //var test = _uow.ReferenceVerif_Scanner_LOG.GetFirstOrDefault(i => i.Id == 1, includeProperties: "User");



            return _json;
        }
        [HttpGet]
        [Route("query-manual/code/{compRef}/num/{reference}/user/{id}")]
        public async Task<string> GetByManual(string compRef, string reference, string id)
        {
            Verifications _verification = new Verifications();
            Verifications _verificationNULL = new Verifications();
            ReferenceDefinitions _def = new ReferenceDefinitions();
            var _json = "";
            await Task.Run(() =>
            {/*
                var _user = _uow.ReferenceVerif_User.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
                var _verification = _uow.ReferenceVerif_Verification.GetFirstOrDefault(v => (v.CustomerReference == num || v.CompanyReference == code), includeProperties: "Company");
                if (_verification != null)
                {
                    if (_user.Admin)
                    {
                        _def = new ReferenceDefinitions
                        {
                            Verifications = _verification
                        };
                    }
                    else
                    {
                        _def = _uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(v => (v.VerificationsId == _verification.Id && v.UserId == Guid.Parse(id)),
            includeProperties: "Verifications");
                    }

                }

                if (_def != null)
                    _json = JsonSerializer.Serialize(_def.Verifications);
                else
                    _json = JsonSerializer.Serialize(_verificationNULL);*/
            });



            //TEST
            var auth = true;
            //var currenVal = reference;
            var _user = _uow.ReferenceVerif_User.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
            var _refNum = _uow.ReferenceVerif_Verification.GetFirstOrDefault(v => (v.CompanyReference == compRef || v.CustomerReference == reference), includeProperties: "CustomerDefinitions.Customer.Company,CustomerDefinitions.Company");
            if (_refNum == null)
            {
                _verification = _uow.ReferenceVerif_Verification.GetFirstOrDefault(v => v.CustomerReference == reference, includeProperties: "CustomerDefinitions.Customer.Company,CustomerDefinitions.Company");
                if (_verification != null)
                {
                    _def = _uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(v => (v.VerificationsId == _verification.Id && v.UserId == Guid.Parse(id)),
                        includeProperties: "Verifications");
                }
            }
            else
            {
                //_verification = _refNum;
                if (_user.Admin)
                {
                    _def = new ReferenceDefinitions
                    {
                        Verifications = _refNum
                    };
                }
                else
                {
                    _def = _uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(v => (v.VerificationsId == _refNum.Id && v.UserId == Guid.Parse(id)),
                        includeProperties: "Verifications");

                    if (_def == null)
                        auth = false;

                }

            }
            //TEST

            if (_def != null)
                _json = JsonSerializer.Serialize(_def.Verifications);
            else
                _json = JsonSerializer.Serialize(_verificationNULL);


            bool _success = false;
            Input_LOG _LOG = null;

            if (_def == null)
            {
                //var _noverify = _uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(v => v.VerificationsId == _refNum.Id, includeProperties: "Verifications");
                _LOG = new Input_LOG()
                {
                    Input_Company = compRef,
                    Input_Customer = reference,
                    CompanyReference = _refNum.CompanyReference,
                    CustomerReference = _refNum.CustomerReference,
                    UserId = _user.Id,
                    UserName = _user.UserName,
                    //FullName = _user.FullName,
                    FullName = _user.Staff.FirstName + " " + _user.Staff.LastName,
                    Date = DateTime.Now,
                    Success = true,
                    Auth = auth,
                    Active = _refNum.Active
                };
            }
            else
            {
                if (_def.Verifications == null)
                {
                    _LOG = new Input_LOG()
                    {
                        Input_Company = compRef,
                        Input_Customer = reference,
                        CompanyReference = "",
                        CustomerReference = "",
                        UserId = _user.Id,
                        UserName = _user.UserName,
                        //FullName = _user.FullName,
                        FullName = _user.Staff.FirstName + " " + _user.Staff.LastName,
                        Date = DateTime.Now,
                        Success = _success,
                        Auth = auth,
                        Active = false
                    };
                }
                else
                {
                    if (_def.Verifications.CustomerReference != null)
                        _success = true;

                    _LOG = new Input_LOG()
                    {
                        Input_Company = compRef,
                        Input_Customer = reference,
                        CompanyReference = _def.Verifications.CompanyReference,
                        CustomerReference = _def.Verifications.CustomerReference,
                        UserId = _user.Id,
                        UserName = _user.UserName,
                        //FullName = _user.FullName,
                        FullName = _user.Staff.FirstName + " " + _user.Staff.LastName,
                        Date = DateTime.Now,
                        Success = _success,
                        Auth = auth,
                        Active = _def.Verifications.Active
                    };
                }
            }



            if (_def != null)
                _json = JsonSerializer.Serialize(_def.Verifications);
            else
                _json = JsonSerializer.Serialize(_verificationNULL);

            try
            {
                _uow.ReferenceVerif_Input_LOG.Add(_LOG);
                _uow.Save();
                WebSocketAction WebSocAct = new WebSocketAction(_context, _uow);
                await WebSocAct.JqueryTrigger_WebSocket();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
            }

            return _json;
        }
        [HttpGet]
        [Route("get-refs/user/{id}")]
        public async Task<string> GetRefsByUser(string id)
        {
            Verifications _verification = new Verifications();
            Verifications _verificationNULL = new Verifications();
            IEnumerable<ReferenceDefinitions> _def = null;
            var _json = "";
            await Task.Run(() =>
            {/*
                var _def = _uow.ReferenceVerif_ReferenceDefinitions.GetAll(a=>a.Verifications.Active,includeProperties: "Verifications")
                .Where(i=>i.Verifications.Id==Guid.Parse(id));
                */
                _def = _uow.ReferenceVerif_ReferenceDefinitions.GetAll(i => i.UserId == Guid.Parse(id), includeProperties: "Verifications");

                if (_def != null)
                    _json = JsonSerializer.Serialize(_def);
                else
                    _json = JsonSerializer.Serialize(_verificationNULL);
            });


            return _json;
        }
        [HttpGet]
        public string Get()
        {
            var Ocr = new IronTesseract();
            using (var Input = new OcrInput("image.png"))
            {
                var Result = Ocr.Read(Input);
                return Result.Text;
            }
        }
        [HttpPost]
        [Route("login-post")]
        public string LoginPostAsync([FromBody] User user)
        {
            var _user = _uow.ReferenceVerif_User.GetFirstOrDefault(u => (u.UserName == user.UserName && u.Password == user.Password));
            if (_user == null)
                return null;

            _user = new User()
            {
                Id = _user.Id,
                UserName = _user.UserName,
                //FullName = _user.FullName,
                FullName = _user.Staff.FirstName + " " + _user.Staff.LastName,
                Active = _user.Active,
                Admin = _user.Admin,
            };
            return JsonSerializer.Serialize(_user);
        }
        [HttpGet()]
        [Route("ver-check/{ver}")]
        public async Task<bool> GetByBarcode(string ver)
        {
            var versionPass = false;
            await Task.Run(() =>
            {
                if (ver == "0.01")
                    versionPass = true;
            });

            return versionPass;
        }
    }
}
