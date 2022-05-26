using Microsoft.EntityFrameworkCore;
using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.Data
{
    public class AccountingDbContext:DbContext
    {
        public AccountingDbContext(DbContextOptions<AccountingDbContext> options)
            : base(options) { }//12 Model
        public DbSet<Company> Company { get; set; }
        public DbSet<IdentificationType> IdentificationType { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<CommercialTitle> CommercialTitle { get; set; }
        public DbSet<CompanyDepartmants> CompanyDepartments { get; set; }
        public DbSet<Contact> Contact { get; set; }
        public DbSet<Departmant> Departmant { get; set; }
        public DbSet<SubCategory> SubCategory { get; set; }
        public DbSet<Tag> Tas { get; set; }
        public DbSet<Bank> Bank { get; set; }
        public DbSet<Identification> Identification { get; set; }
        public DbSet<ContactDefinitions> ContactDefinitions { get; set; }

    }
}
