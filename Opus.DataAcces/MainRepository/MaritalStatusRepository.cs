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
    public class MaritalStatusRepository : Repository<MaritalStatus>, IMaritalStatusRepository
    {
        private readonly ApplicationDbContext _db;

        public MaritalStatusRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(MaritalStatus maritalStatus)
        {
            _db.Update(maritalStatus);
        }
    }
}
