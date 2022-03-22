using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository
{
    public interface IUnitOfWork:IDisposable
    {
        IApplicationUserRepository ApplicationUser { get; }
        ILocationRepository Location { get; }
        IUserLocationRepository UserLocation { get; }
        IStaffRepository Staff { get; }
        void Save();
    }
}
