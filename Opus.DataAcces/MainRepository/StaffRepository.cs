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
    public class StaffRepository : Repository<Staff>, IStaffRepository
    {
        private readonly ApplicationDbContext _db;

        public StaffRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(Staff staff)
        {
            _db.Update(staff);
        }
        public void UpdateRange(IEnumerable<Staff> staffs)
        {
            _db.UpdateRange(staffs);
        }
    }
}
