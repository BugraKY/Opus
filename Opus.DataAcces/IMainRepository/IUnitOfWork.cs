using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.IMainRepository
{
    public interface IUnitOfWork:IDisposable
    {
        #region Main And HR
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
        IMaritalStatusRepository MaritalStatus { get; }
        IEducationalStatusRepository EducationalStatus { get; }
        IStaffResignationRepository StaffResignation { get; }
        IVacationDatesRepository VacationDates { get; }
        #endregion Main And HR


        #region Accounting
        IAccountingRepository.ICompaniesRepository Accounting_Company { get; }
        IAccountingRepository.IIdentificationtypeRepository Accounting_Identificationtype { get; }
        IAccountingRepository.ICategoryRepository Accounting_Category { get; }
        IAccountingRepository.ICompanydepartmantRepository Accounting_Companydepartmant { get; }
        IAccountingRepository.IContactRepository Accounting_Contact { get; }
        IAccountingRepository.IDepartmantRepository Accounting_Departmant { get; }
        IAccountingRepository.ISubcategoryRepository Accounting_Subcategory { get; }
        IAccountingRepository.ITagRepository Accounting_Tag { get; }
        IAccountingRepository.IBankRepository Accounting_Bank { get; }
        IAccountingRepository.IIdentificationRepository Accounting_Identification { get; }
        IAccountingRepository.IContactDefinitionsRepository Accounting_ContactDefinitions { get; }
        IAccountingRepository.ITagDefinitionsRepository Accounting_TagDefinations { get; }
        IAccountingRepository.IStaffRepository Accounting_Staff { get; }
        IAccountingRepository.IPurchaseInvoiceRepository Accounting_PurchaseInvoice { get; }
        IAccountingRepository.IPurchaseInvoiceDetailsRepository Accounting_PurchaseInvoiceDetails { get; }
        IAccountingRepository.IExchangeRateRepository Accounting_ExchangeRate { get; }
        #endregion Accounting


        #region ReferenceVerification
        IReferenceVerifRepository.ICompaniesRepository ReferenceVerif_Company { get; }
        IReferenceVerifRepository.ICustomersRepository ReferenceVerif_Customer { get; }
        IReferenceVerifRepository.ICustomerDefinitionsRepository ReferenceVerif_CustomerDefinitions { get; }
        IReferenceVerifRepository.IVerificationRepository ReferenceVerif_Verification { get; }
        IReferenceVerifRepository.IUserRepository ReferenceVerif_User { get; }
        IReferenceVerifRepository.IReferenceDefinitionsRepository ReferenceVerif_ReferenceDefinitions { get; }
        #endregion ReferenceVerification

        #region ReferenceVerifLOG
        IReferenceVerifLOGRepository.IScannerLOGRepository ReferenceVerif_Scanner_LOG { get; }
        #endregion ReferenceVerifLOG

        void Save();
    }
}
