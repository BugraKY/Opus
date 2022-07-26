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
        private readonly ReferenceVerifDbContext _dbRV;
        public UnitOfWork(ApplicationDbContext db, AccountingDbContext dbAc, ReferenceVerifDbContext dbRV)
        {
            #region Dependency-Injection
            _db = db;
            _dbAc = dbAc;
            _dbRV = dbRV;

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
            VacationDates = new VacationDatesRepository(_db);
            #endregion Main And HR

            #region Accounting
            Accounting_Company = new AccountingRepository.CompaniesRepository(_dbAc);
            Accounting_Identificationtype = new AccountingRepository.IdentificationtypeRepository(_dbAc);
            Accounting_Category = new AccountingRepository.CategoryRepository(_dbAc);
            Accounting_Companydepartmant = new AccountingRepository.CompanydepartmantRepository(_dbAc);
            Accounting_Contact = new AccountingRepository.ContactRepository(_dbAc);
            Accounting_Departmant = new AccountingRepository.DepartmantRepository(_dbAc);
            Accounting_Subcategory = new AccountingRepository.SubcategoryRepository(_dbAc);
            Accounting_Tag = new AccountingRepository.TagRepository(_dbAc);
            Accounting_Bank = new AccountingRepository.BankRepository(_dbAc);
            Accounting_Identification = new AccountingRepository.IdentificationRepository(_dbAc);
            Accounting_ContactDefinitions = new AccountingRepository.ContactDefinitionsRepository(_dbAc);
            Accounting_TagDefinations = new AccountingRepository.TagDefinitionsRepository(_dbAc);
            Accounting_Staff = new AccountingRepository.StaffRepository(_dbAc);
            Accounting_PurchaseInvoice = new AccountingRepository.PurchaseInvoiceRepository(_dbAc);
            Accounting_PurchaseInvoiceDetails = new AccountingRepository.PurchaseInvoiceDetailsRepository(_dbAc);
            Accounting_ExchangeRate = new AccountingRepository.ExchangeRateRepository(_dbAc);
            #endregion Accounting

            #endregion Dependency-Injection

            #region ReferenceVerif
            ReferenceVerif_Company = new ReferenceVerifRepository.CompaniesRepository(_dbRV);
            ReferenceVerif_Verification = new ReferenceVerifRepository.VerificationRepository(_dbRV);
            #endregion ReferenceVerif
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
        public IVacationDatesRepository VacationDates { get; private set; }
        #endregion Main And HR

        #region Accounting
        public IMainRepository.IAccountingRepository.ICompaniesRepository Accounting_Company { get; private set; }
        public IMainRepository.IAccountingRepository.IIdentificationtypeRepository Accounting_Identificationtype { get; private set; }
        public IMainRepository.IAccountingRepository.ICategoryRepository Accounting_Category { get; private set; }
        public IMainRepository.IAccountingRepository.ICompanydepartmantRepository Accounting_Companydepartmant { get; private set;}
        public IMainRepository.IAccountingRepository.IContactRepository Accounting_Contact { get; private set; }
        public IMainRepository.IAccountingRepository.IDepartmantRepository Accounting_Departmant { get; private set; }
        public IMainRepository.IAccountingRepository.ISubcategoryRepository Accounting_Subcategory { get; private set; }
        public IMainRepository.IAccountingRepository.ITagRepository Accounting_Tag { get; private set; }
        public IMainRepository.IAccountingRepository.IBankRepository Accounting_Bank { get; private set; }
        public IMainRepository.IAccountingRepository.IIdentificationRepository Accounting_Identification { get; private set; }
        public IMainRepository.IAccountingRepository.IContactDefinitionsRepository Accounting_ContactDefinitions { get; private set; }
        public IMainRepository.IAccountingRepository.ITagDefinitionsRepository Accounting_TagDefinations { get; private set; }
        public IMainRepository.IAccountingRepository.IStaffRepository Accounting_Staff { get; private set; }
        public IMainRepository.IAccountingRepository.IPurchaseInvoiceRepository Accounting_PurchaseInvoice { get; private set; }
        public IMainRepository.IAccountingRepository.IPurchaseInvoiceDetailsRepository Accounting_PurchaseInvoiceDetails { get; private set; }
        public IMainRepository.IAccountingRepository.IExchangeRateRepository Accounting_ExchangeRate { get; private set; }

        #endregion Accounting

        #region ReferenceVerif
        public IMainRepository.IReferenceVerifRepository.ICompaniesRepository ReferenceVerif_Company { get; private set; }
        public IMainRepository.IReferenceVerifRepository.IVerificationRepository ReferenceVerif_Verification { get; private set; }
        #endregion ReferenceVerif

        #endregion Variables

        public void Dispose()
        {
            _db.Dispose();
            _dbAc.Dispose();
            _dbRV.Dispose();
        }
        public void Save()
        {
            _db.SaveChanges();
            _dbAc.SaveChanges();
            _dbRV.SaveChanges();
        }
    }
}
