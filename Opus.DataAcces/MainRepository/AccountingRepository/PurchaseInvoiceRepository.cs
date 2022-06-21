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
    public class PurchaseInvoiceRepository : Repository<PurchaseInvoice>, IPurchaseInvoiceRepository
    {
        private readonly AccountingDbContext _db;

        public PurchaseInvoiceRepository(AccountingDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(PurchaseInvoice purchaseInvoice)
        {
            _db.Update(purchaseInvoice);
        }
    }
}
