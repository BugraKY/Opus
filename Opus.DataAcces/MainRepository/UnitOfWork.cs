using Opus.DataAcces.Data;
using Opus.DataAcces.IMainRepository;
using Opus.DataAcces.MainRepository;
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
        private readonly AccountingDbContext _dbAc;
        public UnitOfWork(ApplicationDbContext db, AccountingDbContext dbAc)
        {
            #region Dependency-Injection
            _db = db;
            _dbAc = dbAc;

            #region Main And HR
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
            MaritalStatus = new MaritalStatusRepository(_db);
            EducationalStatus = new EducationalStatusRepository(_db);
            StaffResignation = new StaffResignationRepository(_db);
            #endregion Main And HR

            #region Accounting
            Accounting_Company = new AccountingRepository.CompaniesRepository(_dbAc);
            Accounting_Identificationtype = new AccountingRepository.IdentificationtypeRepository(_dbAc);
            Accounting_Category = new AccountingRepository.CategoryRepository(_dbAc);
            Accounting_Commercialtitle = new AccountingRepository.CommercialtitleRepository(_dbAc);
            Accounting_Companydepartmant = new AccountingRepository.CompanydepartmantRepository(_dbAc);
            Accounting_Contact = new AccountingRepository.ContactRepository(_dbAc);
            Accounting_Departmant = new AccountingRepository.DepartmantRepository(_dbAc);
            Accounting_Subcategory = new AccountingRepository.SubcategoryRepository(_dbAc);
            Accounting_Tag = new AccountingRepository.TagRepository(_dbAc);
            Accounting_Bank = new AccountingRepository.BankRepository(_dbAc);
            #endregion Accounting

            #endregion Dependency-Injection
        }

        #region Variables

        #region Main And HR
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
        public IMaritalStatusRepository MaritalStatus { get; private set; }
        public IEducationalStatusRepository EducationalStatus { get; private set; }
        public IStaffResignationRepository StaffResignation { get; private set; }
        #endregion Main And HR

        #region Accounting
        public IMainRepository.IAccountingRepository.ICompaniesRepository Accounting_Company { get; private set; }
        public IMainRepository.IAccountingRepository.IIdentificationtypeRepository Accounting_Identificationtype { get; private set; }
        public IMainRepository.IAccountingRepository.ICategoryRepository Accounting_Category { get; private set; }
        public IMainRepository.IAccountingRepository.ICommercialtitleRepository Accounting_Commercialtitle { get; private set; }
        public IMainRepository.IAccountingRepository.ICompanydepartmantRepository Accounting_Companydepartmant { get; private set;}
        public IMainRepository.IAccountingRepository.IContactRepository Accounting_Contact { get; private set; }
        public IMainRepository.IAccountingRepository.IDepartmantRepository Accounting_Departmant { get; private set; }
        public IMainRepository.IAccountingRepository.ISubcategoryRepository Accounting_Subcategory { get; private set; }
        public IMainRepository.IAccountingRepository.ITagRepository Accounting_Tag { get; private set; }
        public IMainRepository.IAccountingRepository.IBankRepository Accounting_Bank { get; private set; }

        #endregion Accounting

        #endregion Variables

        public void Dispose()
        {
            _db.Dispose();
            _dbAc.Dispose();
        }
        public void DisposeAsync()
        {
            _db.DisposeAsync();
            _dbAc.DisposeAsync();
        }
        public void Save()
        {
            _db.SaveChanges();
            _dbAc.SaveChanges();
        }
        public void SaveAsync()
        {
            _db.SaveChangesAsync();
            _dbAc.SaveChangesAsync();
        }
    }
}
