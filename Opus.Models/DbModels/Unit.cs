using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class Unit
    {
        [Key]
        public int Id { get; set; }
        public string Text { get; set; }
    }
}
