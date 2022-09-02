using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class Training
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public string DocumentImgUrl { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public long LocationId { get; set; }
        [ForeignKey("LocationId")]
        public Location Location { get; set; }
    }
}
