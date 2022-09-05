using Microsoft.AspNetCore.Http;
using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class TrainingVM : Training
    {
        public IFormFile FormFile { get; set; }
        public IEnumerable<StaffTraining> Enumerable_StaffTraining { get; set; }
    }
}
