using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository
{
    public interface ITimeKeepingRepository : IRepository<TimeKeeping>
    {
        void Update(TimeKeeping timeKeeping);
        void UpdateRange (IEnumerable<TimeKeeping> timeKeeping);
    }
}
