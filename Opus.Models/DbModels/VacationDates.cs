using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class VacationDates
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime Beginning { get; set; }
        public DateTime Ending { get; set; }
        public string Description { get; set; }

    }
}
