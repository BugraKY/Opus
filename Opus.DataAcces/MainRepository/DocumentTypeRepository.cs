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
    public class DocumentTypeRepository : Repository<DocumentType>, IDocumentTypeRepository
    {
        private readonly ApplicationDbContext _db;

        public DocumentTypeRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }

        public void Update(DocumentType documentType)
        {
            _db.Update(documentType);
        }
    }
}
