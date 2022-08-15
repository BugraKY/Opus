using Opus.Models.DbModels.ReferenceVerifDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository.IReferenceVerifRepository
{
    public interface ICustomersRepository : IRepository<Customer>
    {
        void Update(Customer customer);
    }
}
