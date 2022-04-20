using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Models.ViewModels
{
    public class DocumentFilesVM
    {
        public class IdentityObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class HealthReportObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class MilitaryStatusObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class DiplomaObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class KVKKLaborAgreementObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class OHSInstructionCommitmentFormObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class BloodTypeObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class DrivingLicenceObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class PlaceResidenceObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class TetanusVaccineObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class KVKKCommitmentReportObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class InternalRegulationObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class InsuranceObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class BusinessArrangementObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class OvertimeObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class CommitmentFormObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class CriminalReportObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class AgiFormObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class WorkSafetyObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class D2TestObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class TaskDefinitionObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public class ImageFileObj
        {
            public int Id { get; set; }
            public IFormFile Name { get; set; }
        }
        public IFormFile Identity { get; set; }
        public IFormFile HealthReport { get; set; }
        public IFormFile MilitaryStatus { get; set; }
        public IFormFile Diploma { get; set; }
        public IFormFile KVKKLaborAgreement { get; set; }//KVKK İş Sözleşmesi Ek Metin
        public IFormFile OHSInstructionCommitmentForm { get; set; }//İSG Talimatı ve Taahhüt Formu
        public IFormFile BloodType { get; set; }
        public IFormFile DrivingLicence { get; set; }
        public IFormFile PlaceResidence { get; set; } //İkametgah
        public IFormFile TetanusVaccine { get; set; }
        public IFormFile KVKKCommitmentReport { get; set; }//KVKK Taahhüt Tutanağı
        public IFormFile InternalRegulation { get; set; }//İç Yönetmenlik
        public IFormFile Insurance { get; set; }
        public IFormFile BusinessArrangement { get; set; }//İş Sözlemşmesi
        public IFormFile Overtime { get; set; }//Fazla Mesai
        public IFormFile CommitmentForm { get; set; }//Zimmet Formu
        public IFormFile MSATest { get; set; }
        public IFormFile CriminalReport { get; set; }
        public IFormFile AgiForm { get; set; }//Asgari geçim indirimi formu
        public IFormFile WorkSafety { get; set; }
        public IFormFile D2Test { get; set; }
        public IFormFile TaskDefinition { get; set; }
        public IFormFile ImageFile { get; set; }



        /*
         * 
         * 
         * 
         == Eski Opusta Olmayanlar ==
        
        
        1. KVKKLaborAgreement
        2. OHSInstructionCommitmentForm
        3. KVKKCommitmentReport
        4. InternalRegulation



         *
         *
         */



    }
}
