using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Opus.Models.DbModels;
using Opus.Models.DbModels.ReferenceVerifDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.Data
{
    public class ReferenceVerifDbContext:DbContext
    {
        public ReferenceVerifDbContext(DbContextOptions<ReferenceVerifDbContext> options)
            : base(options) { }

        public DbSet<Company> Companies { get; set; }
        public DbSet<Verifications> Verifications { get; set; }
    }
}
