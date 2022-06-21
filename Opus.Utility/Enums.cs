using System;
using System.Collections.Generic;
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
            Current= 3
        }
    }
}
