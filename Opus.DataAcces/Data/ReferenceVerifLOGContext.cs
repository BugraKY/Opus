using Microsoft.EntityFrameworkCore;
using Opus.Models.DbModels.ReferenceVerifLOG;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.DataAcces.Data
{
    public class ReferenceVerifLOGContext:DbContext
    {

        public ReferenceVerifLOGContext(DbContextOptions<ReferenceVerifLOGContext> options): base(options) { }
        public DbSet<Scanner_LOG> Scanner_LOG { get; set; }

    }
}
