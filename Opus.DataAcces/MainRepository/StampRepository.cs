using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository;
using Opus.DataAcces.IMainRepository.IAccountingRepository;
using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.MainRepository
{
    public class StampRepository : Repository<Stamp>, IStampRepository
    {
        private readonly ApplicationDbContext _db;

        public StampRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Stamp stamp)
        {
            _db.Update(stamp);
        }
    }
}