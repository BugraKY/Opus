﻿using Opus.Models.DbModels;
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
        public IEnumerable<Location> Locations { get; set; }
    }
}