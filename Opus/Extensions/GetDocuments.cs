using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using Opus.Models.ViewModels.DocumentsObj;

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
                    var _doc = new Identity()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.Identity = _doc;
                }
                if (item.DocumentTypeId == 13)
                {
                    var _doc = new HealthReport()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.HealthReport=_doc;
                }
                if (item.DocumentTypeId == 5)
                {
                    var _doc = new MilitaryStatus()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.MilitaryStatus = _doc;
                }
                if (item.DocumentTypeId == 7)
                {
                    var _doc = new Diploma()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.Diploma = _doc;
                }
                if (item.DocumentTypeId == 21)
                {
                    var _doc = new KVKKLaborAgreement()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.KVKKLaborAgreement = _doc;
                }
                if (item.DocumentTypeId == 22)
                {
                    var _doc = new OHSInstructionCommitmentForm()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.OHSInstructionCommitmentForm = _doc;
                }
                if (item.DocumentTypeId == 12)
                {
                    var _doc = new Models.ViewModels.DocumentsObj.BloodType()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.BloodType = _doc;
                }
                if (item.DocumentTypeId == 3)
                {
                    var _doc = new DrivingLicence()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.DrivingLicence = _doc;
                }
                if (item.DocumentTypeId == 6)
                {
                    var _doc = new PlaceResidence()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.PlaceResidence = _doc;
                }
                if (item.DocumentTypeId == 19)
                {
                    var _doc = new TetanusVaccine()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.TetanusVaccine = _doc;
                }
                if (item.DocumentTypeId == 23)
                {
                    var _doc = new KVKKCommitmentReport()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.KVKKCommitmentReport = _doc;
                }
                if (item.DocumentTypeId == 24)
                {
                    var _doc = new InternalRegulation()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.InternalRegulation = _doc;
                }
                if (item.DocumentTypeId == 1)
                {
                    var _doc = new Insurance()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.Insurance = _doc;
                }
                if (item.DocumentTypeId == 8)
                {
                    var _doc = new BusinessArrangement()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.BusinessArrangement = _doc;
                }
                if (item.DocumentTypeId == 10)
                {
                    var _doc = new Overtime()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.Overtime = _doc;
                }
                if (item.DocumentTypeId == 14)
                {
                    var _doc = new CommitmentForm()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.CommitmentForm = _doc;
                }
                if (item.DocumentTypeId == 4)
                {
                    var _doc = new CriminalReport()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.CriminalReport = _doc;
                }
                if (item.DocumentTypeId == 9)
                {
                    var _doc = new AgiForm()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.AgiForm = _doc;
                }
                if (item.DocumentTypeId == 11)
                {
                    var _doc = new WorkSafety()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.WorkSafety = _doc;
                }
                if (item.DocumentTypeId == 15)
                {
                    var _doc = new D2Test()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.D2Test = _doc;
                }
                if (item.DocumentTypeId == 18)
                {
                    var _doc = new TaskDefinition()
                    {
                        Id = item.Id,
                        FileName = item.FileName,

                    };
                    documentFiles.TaskDefinition = _doc;
                }

                #region documents
                /*
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
                */
                #endregion documents


            }
            return documentFiles;
        }
    }
}
