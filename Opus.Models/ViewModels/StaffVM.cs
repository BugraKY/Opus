using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class StaffVM : Staff
    {
        public bool AddStamp { get; set; }
        [ForeignKey("BloodTypeId")]
        public int BloodTypeId { get; set; }
        [ForeignKey("FamilyMembersId")]
        public string FamilyMembersId { get; set; }
        public List<FamilyMembers> FamilyMembers { get; set; }
    }
}
