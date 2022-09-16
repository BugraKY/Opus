using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;

namespace Opus.Areas.HR.Controllers
{/*
    [Area("HR")]
    [Route("api/[controller]")]
    [ApiController]*/
    public class ValuesController : Controller
    {
        private readonly IUnitOfWork _uow;
        public ValuesController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        //TRY ASYNC for http get!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        /*
        [HttpGet]
        [Route("pub/chat")]   
        public JsonResult TestGet(string data)
        {
            Console.WriteLine("---------------------------------------------------------------");
            Console.WriteLine("receiving data: " + data);
            Console.WriteLine("LOG: " + DateTime.Now.ToString("dd.MM.yyyy")+" - "+DateTime.Now.ToString("HH:mm:ss"));
            Console.WriteLine("---------------------------------------------------------------");
            return Json(data);
        }*/
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
