using Microsoft.AspNetCore.Http;
using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class DocumentVM
    {
        public IFormFile FormFile { get; set; }
        public int DocumentId { get; set; }
        public Documents Documents { get; set; }
        public int DocumentTypeId { get; set; }
    }
}
