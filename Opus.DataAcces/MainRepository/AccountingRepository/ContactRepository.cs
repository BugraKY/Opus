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
    public class ContactRepository : Repository<Contact>, IContactRepository
    {
        private readonly AccountingDbContext _db;

        public ContactRepository(AccountingDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Contact contact)
        {
            _db.Update(contact);
        }
    }
}
