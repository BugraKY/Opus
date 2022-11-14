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
using Opus.Models.DbModels;

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
            //Verifications _verification = new Verifications();
            //Verifications _verificationNULL = new Verifications();
            References _references = new References();
            References _referencesNULL = new References();


            //ReferenceDefinitions _def = new ReferenceDefinitions();
            StaffTraining _def = new StaffTraining();
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
            var _user = _uow.Staff.GetFirstOrDefault(i => i.Guid == id);
            //var _refNum = _uow.References.GetFirstOrDefault(v => v.CompanyReference == currenVal, includeProperties: "CustomerDefinitions.Customer.Company,CustomerDefinitions.Company");
            var _refNum = _uow.References.GetFirstOrDefault(v => (v.BarcodeNum == value && v.Active));
            if (_refNum == null)
            {
                _references = _uow.References.GetFirstOrDefault(v => (v.BarcodeNum == value && v.Active));
                if (_references != null)
                {
                    _def = _uow.StaffTraining.GetFirstOrDefault(v => (v.ReferencesId == _refNum.Id && v.StaffId == _user.Id), includeProperties: "References");
                }
                _referencesNULL.CompanyReference = value;
                _referencesNULL.Valid = false;
                _json = JsonSerializer.Serialize(_referencesNULL);
            }
            else
            {
                _refNum.Valid = true;
                _referencesNULL.Valid = true;
                if (_user.Auth == 1)
                {

                    auth = true;
                    _json = JsonSerializer.Serialize(_refNum);
                }
                else if (_user.Auth == 2)
                {
                    _def = _uow.StaffTraining.GetFirstOrDefault(v => (v.ReferencesId == _refNum.Id && v.StaffId == _user.Id), includeProperties: "References");
                    if (_def == null)
                    {
                        _referencesNULL.CompanyReference = value;
                        _referencesNULL.Reference = _refNum.Reference;
                        auth = false;
                        _json = JsonSerializer.Serialize(_referencesNULL);
                    }
                    else
                    {
                        auth = true;
                        _json = JsonSerializer.Serialize(_refNum);
                    }

                }

            }
            //TEST


            /*
            if (_refNum != null)
                _json = JsonSerializer.Serialize(_refNum);
            else
                _json = JsonSerializer.Serialize(_referencesNULL);*/


            bool _success = false;
            Scanner_LOG _LOG = null;

            if (_def == null)
            {
                /*
                if (auth)
                {

                }
                else
                {

                }*/
                //var _noverify = _uow.ReferenceVerif_ReferenceDefinitions.GetFirstOrDefault(v => v.VerificationsId == _refNum.Id, includeProperties: "Verifications");
                _LOG = new Scanner_LOG()
                {
                    BarcodeNum = value,
                    CompanyReference = _refNum.CompanyReference,
                    CustomerReference = _refNum.Reference,
                    UserId = Guid.Parse(_user.Guid),
                    UserName = _user.AppUser,
                    //FullName = _user.FullName,
                    FullName = _user.FirstName + " " + _user.LastName,
                    Date = DateTime.Now,
                    Success = true,
                    Auth = auth,
                    Active = _refNum.Active
                };
            }
            else
            {
                if (_def.References == null)
                {
                    _LOG = new Scanner_LOG()
                    {
                        BarcodeNum = value,
                        CompanyReference = "",
                        CustomerReference = "",
                        UserId = Guid.Parse(_user.Guid),
                        UserName = _user.AppUser,
                        //FullName = _user.FullName,
                        FullName = _user.FirstName + " " + _user.LastName,
                        Date = DateTime.Now,
                        Success = _success,
                        Auth = auth,
                        Active = false
                    };
                }
                else
                {
                    if (_def.References.Reference != null)
                        _success = true;

                    _LOG = new Scanner_LOG()
                    {
                        BarcodeNum = value,
                        CompanyReference = _def.References.CompanyReference,
                        CustomerReference = _def.References.Reference,
                        UserId = Guid.Parse(_user.Guid),
                        UserName = _user.AppUser,
                        //FullName = _user.FullName,
                        FullName = _user.FirstName + " " + _user.LastName,
                        Date = DateTime.Now,
                        Success = _success,
                        Auth = auth,
                        Active = _def.References.Active
                    };
                }
            }

            if (_user.Auth == 1 && _refNum != null)
            {

                if (_refNum.Reference != null)
                    _success = true;
                else
                    _success = false;



                _LOG = new Scanner_LOG()
                {
                    BarcodeNum = value,
                    CompanyReference = _refNum.CompanyReference,
                    CustomerReference = _refNum.Reference,
                    UserId = Guid.Parse(_user.Guid),
                    UserName = _user.AppUser,
                    //FullName = _user.FullName,
                    FullName = _user.FirstName + " " + _user.LastName,
                    Date = DateTime.Now,
                    Success = true,
                    Auth = auth,
                    Active = _refNum.Active
                };

                /*
                _LOG = new Scanner_LOG()
                {
                    BarcodeNum = value,
                    CompanyReference = _def.References.CompanyReference,
                    CustomerReference = _def.References.Reference,
                    UserId = Guid.Parse(_user.Guid),
                    UserName = _user.AppUser,
                    //FullName = _user.FullName,
                    FullName = _user.FirstName + " " + _user.LastName,
                    Date = DateTime.Now,
                    Success = _success,
                    Auth = auth,
                    Active = _def.References.Active
                };*/

            }
            /*
            #region TEST
            if (_refNum != null)
            {
                if (_user.Auth == 1)
                {
                    auth = true;
                    _json = JsonSerializer.Serialize(_refNum);
                }
                else if (_user.Auth == 2)
                {
                    _def = _uow.StaffTraining.GetFirstOrDefault(v => (v.ReferencesId == _refNum.Id && v.StaffId == _user.Id), includeProperties: "References");
                    if (_def == null)
                    {
                        auth = false;
                        _json = JsonSerializer.Serialize(_referencesNULL);
                    }
                    else
                    {
                        auth = true;
                        _json = JsonSerializer.Serialize(_refNum);
                    }

                }
            }
            #endregion TEST
            */

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
                    _type = 1;



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
            /*
            Verifications _verification = new Verifications();
            Verifications _verificationNULL = new Verifications();
            ReferenceDefinitions _def = new ReferenceDefinitions();*/
            References _references = new References();
            References _referencesNULL = new References();
            StaffTraining _def = new StaffTraining();
            var _json = "";
            /*
            await Task.Run(() =>
            {
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
                    _json = JsonSerializer.Serialize(_verificationNULL);
            });
            */


            //TEST
            var auth = true;
            //var currenVal = reference;
            var _user = _uow.Staff.GetFirstOrDefault(i => i.Guid == id);
            var _refNum = _uow.References.GetFirstOrDefault(v => v.Reference == reference);
            if (_refNum == null)
            {
                _references = _uow.References.GetFirstOrDefault(v => v.Reference == reference);
                if (_references != null)
                {
                    _def = _uow.StaffTraining.GetFirstOrDefault(v => (v.ReferencesId == _references.Id && v.StaffId == _user.Id),
                        includeProperties: "Verifications");
                }
            }
            else
            {
                //_verification = _refNum;
                if (_user.Auth == 1)
                {
                    _json = JsonSerializer.Serialize(_refNum);//test
                }
                else if (_user.Auth == 2)
                {
                    _def = _uow.StaffTraining.GetFirstOrDefault(v => (v.ReferencesId == _refNum.Id && v.StaffId == _user.Id), includeProperties: "References");
                    if (_def == null)
                    {
                        auth = false;
                        _json = JsonSerializer.Serialize(_referencesNULL);
                    }
                    else
                    {
                        auth = true;
                        _json = JsonSerializer.Serialize(_refNum);
                    }

                }

            }
            //TEST
            /*
            if (_def != null)
                _json = JsonSerializer.Serialize(_def.Verifications);
            else
                _json = JsonSerializer.Serialize(_verificationNULL);*/


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
                    CustomerReference = _refNum.Reference,
                    UserId = Guid.Parse(_user.Guid),
                    UserName = _user.AppUser,
                    //FullName = _user.FullName,
                    FullName = _user.FirstName + " " + _user.LastName,
                    Date = DateTime.Now,
                    Success = true,
                    Auth = auth,
                    Active = _refNum.Active
                };
            }
            else
            {
                if (_def.References == null)
                {
                    _LOG = new Input_LOG()
                    {
                        Input_Company = compRef,
                        Input_Customer = reference,
                        CompanyReference = "",
                        CustomerReference = "",
                        UserId = Guid.Parse(_user.Guid),
                        UserName = _user.AppUser,
                        //FullName = _user.FullName,
                        FullName = _user.FirstName + " " + _user.LastName,
                        Date = DateTime.Now,
                        Success = _success,
                        Auth = auth,
                        Active = false
                    };
                }
                else
                {
                    if (_def.References.Reference != null)
                        _success = true;

                    _LOG = new Input_LOG()
                    {
                        Input_Company = compRef,
                        Input_Customer = reference,
                        CompanyReference = _def.References.CompanyReference,
                        CustomerReference = _def.References.Reference,
                        UserId = Guid.Parse(_user.Guid),
                        UserName = _user.AppUser,
                        //FullName = _user.FullName,
                        FullName = _user.FirstName + " " + _user.LastName,
                        Date = DateTime.Now,
                        Success = _success,
                        Auth = auth,
                        Active = _def.References.Active
                    };
                }
            }


            /*
            if (_def != null)
                _json = JsonSerializer.Serialize(_def.References);
            else
                _json = JsonSerializer.Serialize(_referencesNULL);*/

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
            bool _admin = false;
            //var _user = _uow.ReferenceVerif_User.GetFirstOrDefault(u => (u.UserName == user.UserName && u.Password == user.Password));
            var _user = _uow.Staff.GetFirstOrDefault(u => (u.AppUser == user.UserName && u.AppPassword == user.Password));
            if (_user == null)
                return null;

            if (_user.Auth == 1)
                _admin = true;
            else if (_user.Auth == 2)
                _admin = false;

            var _userview = new User()
            {
                Id = Guid.Parse(_user.Guid),
                UserName = _user.AppUser,
                //FullName = _user.FullName,
                FullName = _user.FirstName + " " + _user.LastName,
                Active = _user.Active,
                Admin = _admin,
            };
            return JsonSerializer.Serialize(_userview);
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
