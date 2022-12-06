using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class PersonMotionMain
    {
        public IEnumerable<PersonMotionVM> PersonMotionVMs { get; set; }
        //public IEnumerable<Location> Locations { get; set; }
        public IEnumerable<PersonMotionLocations> PersonMotionLocations { get; set; }

        /*
        public PersonMotionVM PersonMotionVM { get; set; }
        public LocationInOut LocationInOut { get; set; }
        public Location Location { get; set; }
        public string LocationName { get; set; }
        public int Counted { get; set; }*/
    }
}
