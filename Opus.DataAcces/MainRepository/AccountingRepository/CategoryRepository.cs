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
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        private readonly AccountingDbContext _db;

        public CategoryRepository(AccountingDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Category category)
        {
            _db.Update(category);
        }
    }
}
