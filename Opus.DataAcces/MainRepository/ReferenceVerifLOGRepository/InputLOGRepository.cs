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
    public class InputLOGRepository : Repository<Input_LOG>, IInputLOGRepository
    {
        private readonly ReferenceVerifLOGContext _db;
        public InputLOGRepository(ReferenceVerifLOGContext db)
            : base(db)
        {
            _db = db;
        }
        public void Update(Input_LOG input_LOG)
        {
            _db.Update(input_LOG);
        }
    }
}
