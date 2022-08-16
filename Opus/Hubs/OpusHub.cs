using Abp.Dependency;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Opus.Hubs
{
    public class OpusHub : Hub , ITransientDependency
    {
        protected IHubContext<OpusHub> _context;
        public IAbpSession AbpSession { get; set; }
        public OpusHub(IHubContext<OpusHub> context)
        {
            AbpSession = NullAbpSession.Instance;
            _context = context;
        }
        public async Task SendData(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
        public async Task SendTrigger(string url)
        {
            await Clients.All.SendAsync("ReceiveMessage", url);
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
