using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository.IAccountingRepository
{
    public interface ICompanydepartmantRepository : IRepository<CompanyDepartmants>
    {
        void Update(CompanyDepartmants companyDepartmants);
    }
}
