using Opus.Models.DbModels.ReferenceVerifDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels.ReferenceVerif
{
    public class AllModelsVM
    {
        public Company Company { get; set; }
        public Customer Customer { get; set; }
        public CustomerDefinitions CustomerDefinitions { get; set; }
        public IEnumerable<Company> Companies { get; set; }
        public IEnumerable<Customer> Customers { get; set; }
        public IEnumerable<CustomerDefinitions> Enumerable_CustomerDefinitions { get; set; }
    }
}
