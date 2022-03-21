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
    public class UserLocationRepository : Repository<UserLocation>, IUserLocationRepository
    {
        private readonly ApplicationDbContext _db;

        public UserLocationRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(UserLocation userLocation)
        {
            _db.Update(userLocation);
        }
    }
}
