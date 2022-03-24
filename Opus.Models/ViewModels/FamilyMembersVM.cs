using Opus.Models.DbModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class FamilyMembersVM
    {
        public int[] FamilyRelationshipId { get; set; }
        public string[] FullName { get; set; }
        public string[] IdentityNumber { get; set; }
        public string[] BirthPlace { get; set; }
        public string[] DateOfBirth { get; set; }
    }
}
