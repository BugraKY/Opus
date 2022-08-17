using Opus.Models.DbModels.ReferenceVerifLOG;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository.IReferenceVerifLOGRepository
{
    public interface IInputLOGRepository : IRepository<Input_LOG>
    {
        void Update(Input_LOG input_LOG);
    }
}