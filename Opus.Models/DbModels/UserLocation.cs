using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class UserLocation
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string LocationId { get; set; }
        public bool Active { get; set; }
        public int CountryId { get; set; }
    }
}
