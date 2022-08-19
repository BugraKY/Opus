using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.Data
{
    public class ApplicationDbContext:IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options) { }//14 Model
        public DbSet<ApplicationUser> ApplicationUser { get; set; }
        public DbSet<BloodType> BloodTypes { get; set; }
        public DbSet<FamilyMembers> FamilyMembers { get; set; }
        public DbSet<FamilyRelationship> FamilyRelationship { get; set; }
        public DbSet<Location> Location { get; set; }
        public DbSet<Products> Products { get; set; }
        public DbSet<ProductSize> ProductSizes { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Staff> Staff { get; set; }
        public DbSet<UserLocation> UserLocation { get; set; }
        public DbSet<StaffEquipment> StaffEquipment { get; set; }
        public DbSet<Documents> Documents { get; set; }
        public DbSet<DocumentType> DocumentType { get; set; }
        public DbSet<MaritalStatus> MaritalStatus { get; set; }
        public DbSet<EducationalStatus> EducationalStatus { get; set; }
        public DbSet<StaffResignation> StaffResignations { get; set; }
        public DbSet<VacationDates> VacationDates { get; set; }
        public DbSet<Notification> Notification { get; set; }
        //public DbSet<Unit> Unit { get; set; }

        /*
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Staff>()
                        .HasIndex(u => new { u.IdentityNumber }).IsUnique();
        }
        */
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Staff>()
                        .HasIndex(u => new { u.Guid }).IsUnique();
        }
    }
}
