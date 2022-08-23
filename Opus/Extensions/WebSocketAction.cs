using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using Opus.DataAcces.IMainRepository;
using Opus.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using static Opus.Utility.ProjectConstant;
using Microsoft.EntityFrameworkCore;

namespace Opus.Extensions
{
    public class WebSocketAction
    {
        protected IHubContext<OpusHub> _context;
        private readonly IUnitOfWork _uow;
        public WebSocketAction(IHubContext<OpusHub> context, IUnitOfWork uow)
        {
            _context = context;
            _uow = uow;
        }
        public async Task JqueryTrigger_WebSocket()
        {
            OpusHub hub = new OpusHub(_context);
            await hub.SendTrigger();
        }
        public async Task JqueryString_WebSocket(string message)
        {
            OpusHub hub = new OpusHub(_context);
            await hub.SendMessage(message);
        }
        public async Task JqueryJson_WebSocket(object json)
        {
            OpusHub hub = new OpusHub(_context);
            await hub.SendJson(json);
        }
        public async Task JqueryEnum_WebSocket(IEnumerable<object> _enum)
        {
            OpusHub hub = new OpusHub(_context);
            await hub.SendEnum(_enum);
        }
        public async Task JqueryNotify(string html)
        {
            OpusHub hub = new OpusHub(_context);
            await hub.SendNotify(html);
        }
    }
}
