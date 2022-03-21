using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.MainRepository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _db;
        public UnitOfWork(ApplicationDbContext db)
        {
            _db = db;
            ApplicationUser = new ApplicationUserRepository(_db);
            Location = new LocationRepository(_db);
            UserLocation = new UserLocationRepository(_db);
        }
        public IApplicationUserRepository ApplicationUser { get; private set; }
        public ILocationRepository Location { get; private set; }
        public IUserLocationRepository UserLocation { get; private set; }   
        public void Dispose()
        {
            _db.Dispose();
        }

        public void Save()
        {
            _db.SaveChanges();
        }
    }
}
