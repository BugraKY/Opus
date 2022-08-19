using Abp.Dependency;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Opus.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Opus.Hubs
{
    public class OpusHub : Hub, ITransientDependency
    {
        protected IHubContext<OpusHub> _context;
        public IAbpSession AbpSession { get; set; }
        public OpusHub(IHubContext<OpusHub> context)
        {
            AbpSession = NullAbpSession.Instance;
            _context = context;
        }
        public async Task SendMessage(string message)
        {
            await _context.Clients.All.SendAsync("ReceiveMessage", message);
        }
        public async Task SendTrigger()
        {
            await _context.Clients.All.SendAsync("ReceiveTrigger");
        }
        public async Task SendJson(object json)
        {
            await _context.Clients.All.SendAsync("ReceiveJson", json);
        }
        public async Task SendEnum(IEnumerable<object> _enum)
        {
            await _context.Clients.All.SendAsync("ReceiveEnum", _enum);
        }
        public async Task SendNotify(string NotificationHTML)
        {
            await _context.Clients.All.SendAsync("ReceiveHtml", NotificationHTML);
        }
        /*
        public async Task SendDataTable(ProjectListVM ProjectList)
        {
            await _context.Clients.All.SendAsync("SendData", ProjectList);
        }
        public async Task TriggerSchedulerChange(string id)
        {
            await _context.Clients.All.SendAsync("SchedulerQuery", id);

        }
        public async Task SendNotification(IEnumerable<NotificationVM> notification)
        {
            foreach (var item in notification)
            {
                await _context.Clients.All.SendAsync("SendNotification", item);
            }
        }*/
    }
}
