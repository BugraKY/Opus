using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System;
using System.Text;

namespace Opus.Api
{
    [ApiController]
    [AllowAnonymous]
    public class TestController : ControllerBase
    {


        [HttpGet]
        [Route("pub/chat")]
        public string TestGet(UInt16[] data)
        {
            Console.WriteLine("receiving data: "+ data);
            return "null";
        }
    }
}
