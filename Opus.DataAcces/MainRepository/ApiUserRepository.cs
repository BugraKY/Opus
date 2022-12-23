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
    public class ApiUserRepository : Repository<ApiUser>, IApiUserRepository
    {
        private readonly ApplicationDbContext _db;

        public ApiUserRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(ApiUser apiUser)
        {
            _db.Update(apiUser);
        }
    }
}
