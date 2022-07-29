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
        [Route("query-reference/{value}")]
        public async Task<string> GetByBarcode(string value)
        {
            Verifications _verification = new Verifications();
            await Task.Run(() =>
            {
                var _refNum = _uow.ReferenceVerif_Verification.GetFirstOrDefault(v => v.ReferenceNum == value, includeProperties: "Company");
                if (_refNum == null)
                {
                    _verification = _uow.ReferenceVerif_Verification.GetFirstOrDefault(v => v.ReferenceCode == value, includeProperties: "Company");
                }
                else
                    _verification = _refNum;

            });

            var _json = JsonSerializer.Serialize(_verification);

            return _json;
        }
        [HttpGet]
        [Route("query-manual/code/{code}/num/{num}")]
        public async Task<string> GetByManual(string code, string num)
        {
            Verifications _verification = new Verifications();
            var _json = "";
            await Task.Run(() =>
            {
                var _verification = _uow.ReferenceVerif_Verification.GetFirstOrDefault(v => (v.ReferenceNum == num || v.ReferenceCode == code), includeProperties: "Company");
                _json = JsonSerializer.Serialize(_verification);
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
            if(_user == null)
                return null;

            _user = new User()
            {
                UserName = _user.UserName,
                FullName = _user.FullName,
                Active = _user.Active,
                Admin = _user.Admin,
            };
            return JsonSerializer.Serialize(_user);
        }
    }
}
