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
    public class CustomersRepository : Repository<Customer>, ICustomersRepository
    {
        private readonly ReferenceVerifDbContext _db;

        public CustomersRepository(ReferenceVerifDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Customer customer)
        {
            _db.Update(customer);
        }
    }
}
