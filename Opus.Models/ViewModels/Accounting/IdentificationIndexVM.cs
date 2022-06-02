﻿using Opus.Models.DbModels.Accounting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.Accounting
{
    public class IdentificationIndexVM : Identification
    {
        public string CompanyId { get; set; }
        public Company CompanyItem { get; set; }
        public IEnumerable<Company> Companies { get; set; }
        public List<Contact> ContactEnumerable { get; set; }
        public IEnumerable<IdentificationType> IdentificationType_Enumerable { get; set; }
        public IEnumerable<Bank> Bank_Enumerable { get; set; }
        public IEnumerable<Departmant> Departmant_Enumerable { get; set; }
        public IEnumerable<Identification> Identification_Enumerable { get; set; }
        public Identification Identification_Item { get; set; }

    }
}
