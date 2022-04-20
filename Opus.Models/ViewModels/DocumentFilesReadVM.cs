using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Opus.Models.ViewModels.DocumentsObj;

namespace Opus.Models.ViewModels
{
    public class DocumentFilesReadVM
    {
        //public string Identity { get; set; }

        public Identity Identity {get;set;}
        public HealthReport HealthReport { get; set; }
        public MilitaryStatus MilitaryStatus { get; set; }
        public Diploma Diploma { get; set; }
        public KVKKLaborAgreement KVKKLaborAgreement { get; set; }//KVKK İş Sözleşmesi Ek Metin
        public OHSInstructionCommitmentForm OHSInstructionCommitmentForm { get; set; }//İSG Talimatı ve Taahhüt Formu
        public BloodType BloodType { get; set; }
        public DrivingLicence DrivingLicence { get; set; }
        public PlaceResidence PlaceResidence { get; set; } //İkametgah
        public TetanusVaccine TetanusVaccine { get; set; }
        public KVKKCommitmentReport KVKKCommitmentReport { get; set; }//KVKK Taahhüt Tutanağı
        public InternalRegulation InternalRegulation { get; set; }//İç Yönetmenlik
        public Insurance Insurance { get; set; }
        public BusinessArrangement BusinessArrangement { get; set; }//İş Sözlemşmesi
        public Overtime Overtime { get; set; }//Fazla Mesai
        public CommitmentForm CommitmentForm { get; set; }//Zimmet Formu
        public MSATest MSATest { get; set; }
        public CriminalReport CriminalReport { get; set; }
        public AgiForm AgiForm { get; set; }//Asgari geçim indirimi formu
        public WorkSafety WorkSafety { get; set; }
        public D2Test D2Test { get; set; }
        public TaskDefinition TaskDefinition { get; set; }
        public ImageFile ImageFile { get; set; }
    }
}
