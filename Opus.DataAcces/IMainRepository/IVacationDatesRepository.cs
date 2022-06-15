using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository
{
    public interface IVacationDatesRepository : IRepository<VacationDates>
    {
        void Update(VacationDates vacationDates);
    }
}
