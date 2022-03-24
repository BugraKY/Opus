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
    public class ProductCategoryRepository : Repository<ProductCategory>, IProductCategoryRepository
    {
        private readonly ApplicationDbContext _db;

        public ProductCategoryRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(ProductCategory productCategory)
        {
            _db.Update(productCategory);
        }
    }
}
