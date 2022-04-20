using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.DocumentsObj
{
    public class BusinessArrangement
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public IFormFile File { get; set; }
    }
}
