using Opus.Models.DbModels.ReferenceVerifDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.ReferenceVerif
{
    public class ReferenceDefsIndexVM
    {
        public IEnumerable<ReferenceDefinitions> Enum_ReferenceDefinitions { get; set; }

        public IEnumerable<Verifications> Enum_References { get; set; }
        public User User { get; set; }
        public string RefId { get; set; }
        public string UserId { get; set; }
    }
}
