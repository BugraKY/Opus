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
    public class ReferenceDefinitionsRepository : Repository<ReferenceDefinitions>, IReferenceDefinitionsRepository
    {
        private readonly ReferenceVerifDbContext _db;

        public ReferenceDefinitionsRepository(ReferenceVerifDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(ReferenceDefinitions referenceDefinitions)
        {
            _db.Update(referenceDefinitions);
        }
    }
}
