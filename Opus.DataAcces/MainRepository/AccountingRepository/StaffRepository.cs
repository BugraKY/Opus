using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository.IAccountingRepository;
using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.MainRepository.AccountingRepository
{
    public class StaffRepository : Repository<Staff>, IStaffRepository
    {
        private readonly AccountingDbContext _db;

        public StaffRepository(AccountingDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Staff staff)
        {
            _db.Update(staff);
        }
    }
}
