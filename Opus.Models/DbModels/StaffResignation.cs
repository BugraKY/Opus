﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class StaffResignation
    {
        [Key]
        public long Id { get; set; }
        public long StaffId { get; set; }
        public long UserId { get; set; }
        public DateTime ResignationDate { get; set; }
        public string Declaration { get; set; }//Bildirge
        public string Acquittance { get; set; }//İbraname
        public string ResignationLetter { get; set; }//İstifa Mektubu


        /*
                 [ForeignKey("StaffId")]
        public long StaffId { get; set; }
        public Staff Staff { get; set; }
         
         */

    }
}
