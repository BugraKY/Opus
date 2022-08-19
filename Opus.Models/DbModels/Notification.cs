using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; }
        public int Type { get; set; }
        public DateTime Date { get; set; }
        public string Heading { get; set; }
        public string Message { get; set; }
    }
}
