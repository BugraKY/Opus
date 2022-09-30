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
    public class TimeKeepingRepository : Repository<TimeKeeping>, ITimeKeepingRepository
    {
        private readonly ApplicationDbContext _db;

        public TimeKeepingRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(TimeKeeping timeKeeping)
        {
            _db.Update(timeKeeping);
        }
    }
}