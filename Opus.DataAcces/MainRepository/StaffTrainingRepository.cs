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
    public class StaffTrainingRepository : Repository<StaffTraining>, IStaffTrainingRepository
    {
        private readonly ApplicationDbContext _db;

        public StaffTrainingRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(StaffTraining staffTraining)
        {
            _db.Update(staffTraining);
        }
    }
}