using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class VacationVM : VacationDates
    {
        public IEnumerable<VacationDates> EnumerableVacationDates { get; set; }
    }
}
