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
    public class DocumentsRepository : Repository<Documents>, IDocumentsRepository
    {
        private readonly ApplicationDbContext _db;

        public DocumentsRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(Documents documents)
        {
            _db.Update(documents);
        }
    }
}
