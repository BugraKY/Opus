using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class DocumentFilesReadVM
    {
        public string Identity { get; set; }
        public string HealthReport { get; set; }
        public string MilitaryStatus { get; set; }
        public string Diploma { get; set; }
        public string KVKKLaborAgreement { get; set; }//KVKK İş Sözleşmesi Ek Metin
        public string OHSInstructionCommitmentForm { get; set; }//İSG Talimatı ve Taahhüt Formu
        public string BloodType { get; set; }
        public string DrivingLicence { get; set; }
        public string PlaceResidence { get; set; } //İkametgah
        public string TetanusVaccine { get; set; }
        public string KVKKCommitmentReport { get; set; }//KVKK Taahhüt Tutanağı
        public string InternalRegulation { get; set; }//İç Yönetmenlik
        public string Insurance { get; set; }
        public string BusinessArrangement { get; set; }//İş Sözlemşmesi
        public string Overtime { get; set; }//Fazla Mesai
        public string CommitmentForm { get; set; }//Zimmet Formu
        public string MSATest { get; set; }
        public string CriminalReport { get; set; }
        public string AgiForm { get; set; }//Asgari geçim indirimi formu
        public string WorkSafety { get; set; }
        public string D2Test { get; set; }
        public string TaskDefinition { get; set; }
        public string ImageFile { get; set; }
    }
}
