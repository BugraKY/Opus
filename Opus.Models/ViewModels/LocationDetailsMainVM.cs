using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class LocationDetailsMainVM
    {
        public long LocationId { get; set; }
        public string Location { get; set; }
        public string LocationColor { get; set; }
        public IEnumerable<Staff> Staff { get; set; }
        public IEnumerable<LocationDetailsItemVM> LocationDetailItems { get; set; }
    }
}
