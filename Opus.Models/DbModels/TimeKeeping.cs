using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class TimeKeeping
    {
        [Key]
        public long Id { get; set; }
        public long StaffId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string D01 { get; set; }
        public string D02 { get; set; }
        public string D03 { get; set; }
        public string D04 { get; set; }
        public string D05 { get; set; }
        public string D06 { get; set; }
        public string D07 { get; set; }
        public string D08 { get; set; }
        public string D09 { get; set; }
        public string D10 { get; set; }
        public string D11 { get; set; }
        public string D12 { get; set; }
        public string D13 { get; set; }
        public string D14 { get; set; }
        public string D15 { get; set; }
        public string D16 { get; set; }
        public string D17 { get; set; }
        public string D18 { get; set; }
        public string D19 { get; set; }
        public string D20 { get; set; }
        public string D21 { get; set; }
        public string D22 { get; set; }
        public string D23 { get; set; }
        public string D24 { get; set; }
        public string D25 { get; set; }
        public string D26 { get; set; }
        public string D27 { get; set; }
        public string D28 { get; set; }
        public string D29 { get; set; }
        public string D30 { get; set; }
        public string D31 { get; set; }
        public string S1 { get; set; }
        public string T1 { get; set; }
        [NotMapped]
        public int Sequance { get; set; }
    }
}
