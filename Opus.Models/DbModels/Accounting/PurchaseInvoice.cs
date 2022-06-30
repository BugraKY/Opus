﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.Accounting
{
    public class PurchaseInvoice
    {
        [Key]
        public Guid Id { get; set; }
        public Guid IdentificationId { get; set; }
        [ForeignKey("IdentificationId")]
        public Identification Identification { get; set; }
        public DateTime DocDate { get; set; }
        public string DocNo { get; set; }
        public int PaymentMethId { get; set; }
        [ForeignKey("PaymentMethId")]
        public PaymentMeth PaymentMeth { get; set; }
        public DateTime PaymentTerm { get; set; }
        public float OutofVat { get; set; }
        public float Vat { get; set; }
        public float Vat_1 { get; set; }
        public float Vat_8 { get; set; }
        public float Vat_18 { get; set; }
        public float Discount { get; set; }
        public float TotalAmount { get; set; }
        public int ExchangeRateId { get; set; }
        [ForeignKey("ExchangeRateId")]
        public ExchangeRate ExchangeRate { get; set; }
        public Guid? CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company Company { get; set; }
    }
}