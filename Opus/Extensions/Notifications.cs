
using Opus.Utility;

namespace Opus.Extensions
{
    public class Notifications
    {
        public string Set(Enums.NotifyType_User NotifyType, string message)
        {
            return NotifyType.ToString() + message + ProjectConstant.Notification.END_TAGS.TAG_I;
        }
    }
}
