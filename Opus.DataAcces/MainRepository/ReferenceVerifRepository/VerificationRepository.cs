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
    public class VerificationRepository : Repository<Verifications>, IVerificationRepository
    {
        private readonly ReferenceVerifDbContext _db;

        public VerificationRepository(ReferenceVerifDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Verifications verifications)
        {
            _db.Update(verifications);
        }
    }
}
