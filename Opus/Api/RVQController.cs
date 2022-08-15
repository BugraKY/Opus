using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IronOcr;
using Microsoft.AspNetCore.Authorization;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels.ReferenceVerifDb;
using System.Text.Json;

namespace Opus.Api
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/rv")]
    public class RVQController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        public RVQController(IUnitOfWork uow)
        {
            _uow = uow;
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
                }

            }
            //TEST

            if (_def != null)
                _json = JsonSerializer.Serialize(_def.Verifications);
            else
                _json = JsonSerializer.Serialize(_verificationNULL);

            return _json;
        }
        [HttpGet]
        [Route("query-manual/code/{code}/num/{num}/user/{id}")]
        public async Task<string> GetByManual(string code, string num, string id)
        {
            Verifications _verification = new Verifications();
            Verifications _verificationNULL = new Verifications();
            ReferenceDefinitions _def = new ReferenceDefinitions();
            var _json = "";
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
                FullName = _user.FullName,
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
