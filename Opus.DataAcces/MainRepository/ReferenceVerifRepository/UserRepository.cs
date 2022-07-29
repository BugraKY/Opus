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
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly ReferenceVerifDbContext _db;

        public UserRepository(ReferenceVerifDbContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(User user)
        {
            _db.Update(user);
        }
    }
}
