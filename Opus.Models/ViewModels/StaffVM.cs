using Microsoft.AspNetCore.Http;
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
        [ForeignKey("FamilyMembersId")]
        public string FamilyMembersId { get; set; }
        public BloodType BloodType { get; set; }
        public FamilyMembersVM FamilyMembers { get; set; }
        public StaffEquipmentVm StaffEquipment { get; set; }
        public IEnumerable<FamilyMembers> FamilyMembersEnumerable { get; set; }
        public IEnumerable<StaffEquipment> StaffEquipmentEnumerable { get; set; }
        public IEnumerable<Products> Products { get; set; }
        public DocumentFilesVM Files { get; set; }
    }
}
