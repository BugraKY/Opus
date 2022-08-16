using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Opus.Models.DbModels.ReferenceVerifDb;

namespace Opus.Models.DbModels.ReferenceVerifLOG
{
    public class Scanner_LOG
    {
        [Key]
        public long Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string BarcodeNum { get; set; }
        public string CompanyReference { get; set; }
        public string CustomerReference { get; set; }
        public DateTime Date { get; set; }
        public bool Success { get; set; }
        public bool Active { get; set; }
    }
}
