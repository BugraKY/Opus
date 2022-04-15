using Opus.Models.DbModels;
using Opus.Models.ViewModels;

namespace Opus.Extensions
{
    public class GetDocuments
    {
        public static DocumentFilesReadVM GetByStaff(IEnumerable<Documents> documents)
        {
            DocumentFilesReadVM documentFiles = new DocumentFilesReadVM();
            foreach (var item in documents)
            {
                if (item.DocumentTypeId == 2)
                {
                    documentFiles.Identity = item.FileName;
                }
                if (item.DocumentTypeId == 13)
                {
                    documentFiles.HealthReport = item.FileName;
                }
                if (item.DocumentTypeId == 5)
                {
                    documentFiles.MilitaryStatus = item.FileName;
                }
                if (item.DocumentTypeId == 7)
                {
                    documentFiles.Diploma = item.FileName;
                }
                if (item.DocumentTypeId == 21)
                {
                    documentFiles.KVKKLaborAgreement = item.FileName;
                }
                if (item.DocumentTypeId == 22)
                {
                    documentFiles.OHSInstructionCommitmentForm = item.FileName;
                }
                if (item.DocumentTypeId == 12)
                {
                    documentFiles.BloodType = item.FileName;
                }
                if (item.DocumentTypeId == 3)
                {
                    documentFiles.DrivingLicence = item.FileName;
                }
                if (item.DocumentTypeId == 6)
                {
                    documentFiles.PlaceResidence = item.FileName;
                }
                if (item.DocumentTypeId == 19)
                {
                    documentFiles.TetanusVaccine = item.FileName;
                }
                if (item.DocumentTypeId == 23)
                {
                    documentFiles.KVKKCommitmentReport = item.FileName;
                }
                if (item.DocumentTypeId == 24)
                {
                    documentFiles.InternalRegulation = item.FileName;
                }
                if (item.DocumentTypeId == 1)
                {
                    documentFiles.Insurance = item.FileName;
                }
                if (item.DocumentTypeId == 8)
                {
                    documentFiles.BusinessArrangement = item.FileName;
                }
                if (item.DocumentTypeId == 10)
                {
                    documentFiles.Overtime = item.FileName;
                }
                if (item.DocumentTypeId == 14)
                {
                    documentFiles.CommitmentForm = item.FileName;
                }
                if (item.DocumentTypeId == 4)
                {
                    documentFiles.CriminalReport = item.FileName;
                }
                if (item.DocumentTypeId == 9)
                {
                    documentFiles.AgiForm = item.FileName;
                }
                if (item.DocumentTypeId == 11)
                {
                    documentFiles.WorkSafety = item.FileName;
                }
                if (item.DocumentTypeId == 15)
                {
                    documentFiles.D2Test = item.FileName;
                }
                if (item.DocumentTypeId == 18)
                {
                    documentFiles.TaskDefinition = item.FileName;
                }
            }
            return documentFiles;
        }
    }
}
