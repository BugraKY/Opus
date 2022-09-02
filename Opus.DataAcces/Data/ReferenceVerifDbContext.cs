using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Opus.Models.DbModels.ReferenceVerifDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.Data
{
    public class ReferenceVerifDbContext : DbContext
    {
        public ReferenceVerifDbContext(DbContextOptions<ReferenceVerifDbContext> options)
            : base(options) { }

        public DbSet<Company> Companies { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<CustomerDefinitions> CustomersDefinitions { get; set; }
        public DbSet<Verifications> Verifications { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ReferenceDefinitions> ReferenceDefinitions { get; set; }
        /*
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<User>().HasKey(i => i.StaffId);
            //modelBuilder.Entity<User>().HasOne(i => i.Staff).WithOne().HasPrincipalKey();

            //modelBuilder.Entity<User>().HasOne(t => t.Staff).WithMany().HasPrincipalKey(i => i.Id);

            //Database.SetInitializer<User>(null);
            //modelBuilder.Entity<User>().OwnsOne(i => i.Staff).WithOwner().HasPrincipalKey(i => i.Id);


            modelBuilder.Entity<User>(b =>
            {
                b.HasOne(e => e.Staff).WithOne().IsRequired();
            });
            base.OnModelCreating(modelBuilder);
        }
        */
    }
}
