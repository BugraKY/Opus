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
    public class LocationRepository : Repository<Location>, ILocationRepository
    {
        private readonly ApplicationDbContext _db;
        public LocationRepository(ApplicationDbContext db)
    : base(db)
        {
            _db = db;
        }

        public void Update(Location location)
        {
            _db.Update(location);
        }
    }
}
