using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;

namespace Opus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        public ValuesController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        /*
        [HttpPost("checkid-num")]
        public bool IdNumberIsUnique(string IdentityNumber)
        {
            var _check = _uow.Staff.GetFirstOrDefault(i => i.IdentityNumber == IdentityNumber);
            if (_check == null)
                return true;
            return false;
        }
        [HttpGet("test")]
        public bool Test(string IdentityNumber)
        {
            var _check = _uow.Staff.GetFirstOrDefault(i => i.IdentityNumber == IdentityNumber);
            if (_check == null)
                return true;
            return false;
        }
        */
    }
}
