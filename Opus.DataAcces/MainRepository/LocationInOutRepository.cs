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
    public class LocationInOutRepository : Repository<LocationInOut>, ILocationInOutRepository
    {
        private readonly ApplicationDbContext _db;

        public LocationInOutRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(LocationInOut locationInOut)
        {
            _db.Update(locationInOut);
        }

        public void UpdateRange(IEnumerable<LocationInOut> locationInOut)
        {
            _db.UpdateRange(locationInOut);
        }
    }
}