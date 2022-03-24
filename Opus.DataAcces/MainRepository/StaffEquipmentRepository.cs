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
    public class StaffEquipmentRepository : Repository<StaffEquipment>, IStaffEquipmentRepository
    {
        private readonly ApplicationDbContext _db;

        public StaffEquipmentRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(StaffEquipment equipment)
        {
            _db.Update(equipment);
        }
    }
}
