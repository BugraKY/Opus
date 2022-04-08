using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.MainRepository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _db;
        public UnitOfWork(ApplicationDbContext db)
        {
            _db = db;
            ApplicationUser = new ApplicationUserRepository(_db);
            Location = new LocationRepository(_db);
            UserLocation = new UserLocationRepository(_db);
            Staff = new StaffRepository(_db);
            BloodType = new BloodTypeRepository(_db);
            FamilyMembers = new FamilyMembersRepository(_db);
            FamilyRelationship = new FamilyRelationshipRepository(_db);
            Products = new ProductsRepository(_db);
            ProductSize = new ProductSizeRepository(_db);
            ProductCategory = new ProductCategoryRepository(_db);
            StaffEquipment = new StaffEquipmentRepository(_db);
            Documents = new DocumentsRepository(_db);
            DocumentType = new DocumentTypeRepository(_db);
        }
        public IApplicationUserRepository ApplicationUser { get; private set; }
        public ILocationRepository Location { get; private set; }
        public IUserLocationRepository UserLocation { get; private set; }
        public IStaffRepository Staff { get; private set; }
        public IBloodTypeRepository BloodType { get; private set; }
        public IFamilyMembersRepository FamilyMembers { get; private set; }
        public IFamilyRelationshipRepository FamilyRelationship { get; private set; }
        public IProductsRepository Products { get; private set; }
        public IProductSizeRepository ProductSize { get; private set; }
        public IProductCategoryRepository ProductCategory { get; private set; }
        public IStaffEquipmentRepository StaffEquipment { get; private set; }
        public IDocumentsRepository Documents { get; private set; }
        public IDocumentTypeRepository DocumentType { get; private set; }
        public void Dispose()
        {
            _db.Dispose();
        }

        public void Save()
        {
            _db.SaveChanges();
        }
    }
}
