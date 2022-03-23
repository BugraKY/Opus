using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels
{
    public class FamilyMembers
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("FamilyRelationshipId")]
        public int FamilyRelationshipId { get; set; }
        public FamilyRelationship FamilyRelationship { get; set; }
        public string StaffId { get; set; }
        public string FullName { get; set; }
        public string IdentityNumber { get; set; }
        public string BirthPlace { get; set; }
        public DateTime DateOfBirth { get; set; }

    }
}
