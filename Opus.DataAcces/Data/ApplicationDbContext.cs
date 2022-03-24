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
    : base(options) { }//10

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

    }
}
