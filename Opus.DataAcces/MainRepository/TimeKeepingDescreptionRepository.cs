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
    public class TimeKeepingDescreptionRepository : Repository<TimeKeepingDescreption>, ITimeKeepingDescreptionRepository
    {
        private readonly ApplicationDbContext _db;

        public TimeKeepingDescreptionRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(TimeKeepingDescreption timeKeepingDescreption)
        {
            _db.Update(timeKeepingDescreption);
        }
        public void UpdateRange(IEnumerable<TimeKeepingDescreption> timeKeepingDescreption)
        {
            _db.UpdateRange(timeKeepingDescreption);
        }
    }
}