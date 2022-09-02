using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class StaffTraining
    {
        [Key]
        public long Id { get; set; }


        public Guid TrainingId { get; set; }
        [ForeignKey("TrainingId")]
        public Training Training { get; set; }


        public long StaffId { get; set; }
        [ForeignKey("StaffId")]
        public Staff Staff { get; set; }


        public Guid TrainerId { get; set; }
        [ForeignKey("TrainerId")]
        public Trainer Trainer { get; set; }


        public Guid ReferencesId { get; set; }
        [ForeignKey("ReferencesId")]
        public References References { get; set; }

    }
}
