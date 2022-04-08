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
        IBloodTypeRepository BloodType { get; }
        IFamilyMembersRepository FamilyMembers { get; }
        IFamilyRelationshipRepository FamilyRelationship { get; }
        IProductsRepository Products { get; }
        IProductSizeRepository ProductSize { get; }
        IProductCategoryRepository ProductCategory { get; }
        IStaffEquipmentRepository StaffEquipment { get; }
        IDocumentTypeRepository DocumentType { get; }
        IDocumentsRepository Documents { get; }
        void Save();
    }
}
