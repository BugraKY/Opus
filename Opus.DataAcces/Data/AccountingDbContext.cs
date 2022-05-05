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
            : base(options) { }//1 Model
        public DbSet<Company> Company { get; set; }
    }
}
