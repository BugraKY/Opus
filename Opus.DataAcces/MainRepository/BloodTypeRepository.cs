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
    public class BloodTypeRepository : Repository<BloodType>, IBloodTypeRepository
    {
        private readonly ApplicationDbContext _db;

        public BloodTypeRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(BloodType bloodType)
        {
            _db.Update(bloodType);
        }
    }
}
