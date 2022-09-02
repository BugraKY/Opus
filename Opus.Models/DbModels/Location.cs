using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class Location
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public bool Active { get; set; }
        public bool IsDelete { get; set; }
        public string LocationUrl { get; set; }
        public long CountryId { get; set; }
        public string ColorHex { get; set; }
    }
}
