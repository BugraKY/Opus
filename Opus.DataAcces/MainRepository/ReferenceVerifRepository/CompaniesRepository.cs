using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository.IReferenceVerifRepository;
using Opus.Models.DbModels.ReferenceVerifDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.MainRepository.ReferenceVerifRepository
{
    public class CompaniesRepository : Repository<Company>, ICompaniesRepository
    {
        private readonly ReferenceVerifDbContext _db;

        public CompaniesRepository(ReferenceVerifDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Company company)
        {
            _db.Update(company);
        }
    }
}
