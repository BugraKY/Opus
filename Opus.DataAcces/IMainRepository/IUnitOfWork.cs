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
        IMaritalStatusRepository MaritalStatus { get; }
        IEducationalStatusRepository EducationalStatus { get; }
        IStaffResignationRepository StaffResignation { get; }

        IAccountingRepository.ICompaniesRepository Accounting_Company { get; }
        IAccountingRepository.IIdentificationtypeRepository Accounting_Identificationtype { get; }
        IAccountingRepository.ICategoryRepository Accounting_Category { get; }
        IAccountingRepository.ICommercialtitleRepository Accounting_Commercialtitle { get; }
        IAccountingRepository.ICompanydepartmantRepository Accounting_Companydepartmant { get; }
        IAccountingRepository.IContactRepository Accounting_Contact { get; }
        IAccountingRepository.IDepartmantRepository Accounting_Departmant { get; }
        IAccountingRepository.ISubcategoryRepository Accounting_Subcategory { get; }
        IAccountingRepository.ITagRepository Accounting_Tag { get; }
        IAccountingRepository.IBankRepository Accounting_Bank { get; }
        IAccountingRepository.IIdentificationRepository Accounting_Identification { get; }
        IAccountingRepository.IContactDefinitionsRepository Accounting_ContactDefinitions { get; }
        void Save();
    }
}
