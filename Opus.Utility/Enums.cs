using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Utility
{
    public class Enums
    {
        public enum StatusOfStaff
        {
            Quit = 2,
            Active = 1,
            Passive = 0
        }
        public enum BankCode
        {

        }
        public enum ExchangeRate
        {
            TRY = 1,
            USD = 2,
            EUR = 3
        }
        public enum PaymentMethod
        {
            Cash = 1,
            CreditCard = 2,
            Current = 3
        }
        public enum NotifyType_User
        {
            //[Description(ProjectConstant.Notification.TYPEUSER.DANGER_I_TAG)]
            Danger = 1,
            //[Description(ProjectConstant.Notification.TYPEUSER.WARNING_I_TAG)]
            Warning = 2,
            //[Description(ProjectConstant.Notification.TYPEUSER.INFO_I_TAG)]
            Info = 3,
            //[Description(ProjectConstant.Notification.TYPEUSER.SUCCESS_I_TAG)]
            Success = 4
        }
        public enum SocketTriggerType
        {
            Notification=0,
            Chat=1,
            QS_Ref_LOG=2
        }
    }
}
