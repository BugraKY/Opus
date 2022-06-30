﻿using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class BuyingDetails
    {
        //buyinginp id -- foreignkey
        public TagDefinitions TagDefinitions { get; set; }
        [ForeignKey("TagDefinitionsId")]
        public Guid TagDefinitionsId { get; set; }
        public int Piece { get; set; }
        public float Price { get; set; }
        public float Vat_Rate { get; set; }
        public float Vat { get; set; }
        public float Discount_Rate { get; set; }
        public float Discount { get; set; }
        public float Total { get; set; }
    }
}