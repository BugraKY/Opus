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
    public class EducationalStatusRepository : Repository<EducationalStatus>, IEducationalStatusRepository
    {
        private readonly ApplicationDbContext _db;

        public EducationalStatusRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(EducationalStatus educationalStatus)
        {
            _db.Update(educationalStatus);
        }
    }
}
