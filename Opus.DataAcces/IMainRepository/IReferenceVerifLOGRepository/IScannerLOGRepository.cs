using Opus.Models.DbModels.ReferenceVerifLOG;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository.IReferenceVerifLOGRepository
{
    public interface IScannerLOGRepository : IRepository<Scanner_LOG>
    {
        void Update(Scanner_LOG scanner_LOG);
    }
}