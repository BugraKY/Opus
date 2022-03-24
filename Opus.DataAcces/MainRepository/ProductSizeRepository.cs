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
    public class ProductSizeRepository : Repository<ProductSize>, IProductSizeRepository
    {
        private readonly ApplicationDbContext _db;

        public ProductSizeRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(ProductSize productSize)
        {
            _db.Update(productSize);
        }
    }
}
