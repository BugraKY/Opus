using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.MainRepository
{
    public class VacationDatesRepository : Repository<VacationDates>, IVacationDatesRepository
    {
        private readonly ApplicationDbContext _db;

        public VacationDatesRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(VacationDates vacationDates)
        {
            _db.Update(vacationDates);
        }
    }
}
