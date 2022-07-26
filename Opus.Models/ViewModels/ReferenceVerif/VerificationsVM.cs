using Opus.Models.DbModels.ReferenceVerifDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.ReferenceVerif
{
    public class VerificationsVM:Verifications
    {
        public string ActiveSTR { get; set; }
    }
}
