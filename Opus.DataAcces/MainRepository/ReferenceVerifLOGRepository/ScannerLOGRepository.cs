using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository.IReferenceVerifLOGRepository;
using Opus.DataAcces.IMainRepository.IReferenceVerifRepository;
using Opus.Models.DbModels.ReferenceVerifLOG;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.MainRepository.ReferenceVerifLOGRepository
{
    public class ScannerLOGRepository : Repository<Scanner_LOG>, IScannerLOGRepository
    {
        private readonly ReferenceVerifLOGContext _db;
        public ScannerLOGRepository(ReferenceVerifLOGContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Scanner_LOG scanner_LOG)
        {
            _db.Update(scanner_LOG);
        }
    }
}
