using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class ErrorMessage
    {
        public object Value { get; set; }
        public Exception Exception { get; set; }
        public string ContentType { get; set; }
        public int StatusCode { get; set; }

    }
}
