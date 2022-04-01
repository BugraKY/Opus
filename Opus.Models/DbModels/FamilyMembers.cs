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
        public int Id { get; set; }//[PersonelEsCocukID]
        [ForeignKey("FamilyRelationshipId")]
        public int FamilyRelationshipId { get; set; }//[TanimEsCocukTipiID] or [Tip] this is complicated
        public FamilyRelationship FamilyRelationship { get; set; }
        public string StaffId { get; set; }//[PersonelBilgiID]
        public string FullName { get; set; }//[AdiSoyadi]
        public string IdentityNumber { get; set; }//[TcKimlikNo]
        public string BirthPlace { get; set; }//[DogumYeri]
        public DateTime DateOfBirth { get; set; }//[DogumTarihi]

    }
}
