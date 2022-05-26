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
    public class IdentificationtypeRepository : Repository<IdentificationType>, IIdentificationtypeRepository
    {
        private readonly AccountingDbContext _db;

        public IdentificationtypeRepository(AccountingDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(IdentificationType identificationType)
        {
            _db.Update(identificationType);
        }
    }
}
