using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

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
            Notification = 0,
            Chat = 1,
            QS_Ref_LOG = 2
        }

        public enum TimeKeeping:int
        {
            D00,
            D01,
            D02,
            D03,
            D04,
            D05,
            D06,
            D07,
            D08,
            D09,
            D10,
            D11,
            D12,
            D13,
            D14,
            D15,
            D16,
            D17,
            D18,
            D19,
            D20,
            D21,
            D22,
            D23,
            D24,
            D25,
            D26,
            D27,
            D28,
            D29,
            D30,
            D31,
        }
    }
}
