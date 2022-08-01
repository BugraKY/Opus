using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.DbModels.ReferenceVerifDb
{
    public class ReferenceDefinitions
    {
        [Key]
        public Guid Id { get; set; }
        public Guid VerificationsId { get; set; }
        [ForeignKey("VerificationsId")]
        public Verifications Verifications { get; set; }
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
