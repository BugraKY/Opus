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
    public class FamilyRelationshipRepository : Repository<FamilyRelationship>, IFamilyRelationshipRepository
    {
        private readonly ApplicationDbContext _db;

        public FamilyRelationshipRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(FamilyRelationship familyRelationship)
        {
            _db.Update(familyRelationship);
        }
    }
}
