﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class Products
    {
        [Key]
        public long Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        [ForeignKey("ProductCategoryId")]
        public int ProductCategoryId { get; set; }
        public ProductCategory ProductCategory { get; set; }
        [ForeignKey("ProductId")]
        public int ProductId { get; set; }
        public IEnumerable<ProductSize> ProductSize { get; set; }
    }
}
