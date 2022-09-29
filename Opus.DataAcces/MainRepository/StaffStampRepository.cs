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
    public class StaffStampRepository : Repository<StaffStamp>, IStaffStampRepository
    {
        private readonly ApplicationDbContext _db;

        public StaffStampRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(StaffStamp staffStamp)
        {
            _db.Update(staffStamp);
        }
        public void UpdateRange(IEnumerable<StaffStamp> staffStamps)
        {
            _db.UpdateRange(staffStamps);
        }
    }
}
