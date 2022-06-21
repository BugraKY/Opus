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
            : base(options) { }//13 Model
        public DbSet<Company> Company { get; set; }
        public DbSet<IdentificationType> IdentificationType { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<CompanyDepartmants> CompanyDepartments { get; set; }
        public DbSet<Contact> Contact { get; set; }
        public DbSet<Departmant> Departmant { get; set; }
        public DbSet<SubCategory> SubCategory { get; set; }
        public DbSet<Tag> Tag { get; set; }
        public DbSet<Bank> Bank { get; set; }
        public DbSet<Identification> Identification { get; set; }
        public DbSet<ContactDefinitions> ContactDefinitions { get; set; }
        public DbSet<TagDefinitions> TagDefinitions { get; set; }
        public DbSet<Staff> Staff { get; set; }
        public DbSet<PaymentMeth> PaymentMeth { get; set; }
        public DbSet<PurchaseInvoice> PurchaseInvoice { get; set; }
        public DbSet<PurchaseInvoiceDetails> PurchaseInvoiceDetails { get; set; }
        public DbSet<ExchangeRate> ExchangeRate { get; set; }

    }
}
