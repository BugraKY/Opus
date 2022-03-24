using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository
{
    public interface IProductSizeRepository : IRepository<ProductSize>
    {
        void Update(ProductSize productSize);
    }
}
