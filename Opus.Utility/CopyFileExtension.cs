using Microsoft.AspNetCore.Http;
using Opus.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Opus.Utility.ProjectConstant.Path;

namespace Opus.Utility
{
    public class CopyFileExtension
    {
        //private static readonly List<string> uploads;
        public static void Upload (DocumentFilesVM Files,string webRootPath)
        {
            List<string> uploads = new List<string>();
            List<IFormFile> FileList=new List<IFormFile> ();
            #region Identity
            if (Files.Identity != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.Identity + Files.Identity.FileName);
                uploads.Add(upload);
                FileList.Add(Files.Identity);
            }
            #endregion Identity

            #region HealthReport
            if (Files.HealthReport != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.HealthReport + Files.HealthReport.FileName);
                uploads.Add(upload);
                FileList.Add(Files.HealthReport);
            }
            #endregion HealthReport

            #region MilitaryStatus
            if (Files.MilitaryStatus != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.MilitaryStatus + Files.MilitaryStatus.FileName);
                uploads.Add(upload);
                FileList.Add(Files.MilitaryStatus);
            }
            #endregion MilitaryStatus

            #region Diploma
            if (Files.Diploma != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.Diploma + Files.Diploma.FileName);
                uploads.Add(upload);
                FileList.Add(Files.Diploma);
            }
            #endregion Diploma

            #region KVKKLaborAgreement
            if (Files.KVKKLaborAgreement != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.KVKKLaborAgreement + Files.KVKKLaborAgreement.FileName);
                uploads.Add(upload);
                FileList.Add(Files.KVKKLaborAgreement);
            }
            #endregion KVKKLaborAgreement

            #region OHSInstructionCommitmentForm
            if (Files.OHSInstructionCommitmentForm != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.OHSInstructionCommitmentForm + Files.OHSInstructionCommitmentForm.FileName);
                uploads.Add(upload);
                FileList.Add(Files.OHSInstructionCommitmentForm);
            }
            #endregion OHSInstructionCommitmentForm

            #region BloodType
            if (Files.BloodType != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.BloodType + Files.BloodType.FileName);
                uploads.Add(upload);
                FileList.Add(Files.BloodType);
            }
            #endregion BloodType

            #region DrivingLicence
            if (Files.DrivingLicence != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.DrivingLicence + Files.DrivingLicence.FileName);
                uploads.Add(upload);
                FileList.Add(Files.DrivingLicence);
            }
            #endregion DrivingLicence

            #region PlaceResidence
            if (Files.PlaceResidence != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.PlaceResidence + Files.PlaceResidence.FileName);
                uploads.Add(upload);
                FileList.Add(Files.PlaceResidence);
            }
            #endregion PlaceResidence

            #region TetanusVaccine
            if (Files.TetanusVaccine != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.TetanusVaccine + Files.TetanusVaccine.FileName);
                uploads.Add(upload);
                FileList.Add(Files.TetanusVaccine);
            }
            #endregion TetanusVaccine

            #region KVKKCommitmentReport
            if (Files.KVKKCommitmentReport != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.KVKKCommitmentReport + Files.KVKKCommitmentReport.FileName);
                uploads.Add(upload);
                FileList.Add(Files.KVKKCommitmentReport);
            }
            #endregion KVKKCommitmentReport

            #region InternalRegulation
            if (Files.InternalRegulation != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.InternalRegulation + Files.InternalRegulation.FileName);
                uploads.Add(upload);
                FileList.Add(Files.InternalRegulation);
            }
            #endregion InternalRegulation

            #region Insurance
            if (Files.Insurance != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.Insurance + Files.Insurance.FileName);
                uploads.Add(upload);
                FileList.Add(Files.Insurance);
            }
            #endregion Insurance

            #region BusinessArrangement
            if (Files.BusinessArrangement != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.BusinessArrangement + Files.BusinessArrangement.FileName);
                uploads.Add(upload);
                FileList.Add(Files.BusinessArrangement);
            }
            #endregion BusinessArrangement

            #region Overtime
            if (Files.Overtime != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.Overtime + Files.Overtime.FileName);
                uploads.Add(upload);
                FileList.Add(Files.Overtime);
            }
            #endregion Overtime

            #region CommitmentForm
            if (Files.CommitmentForm != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.CommitmentForm + Files.CommitmentForm.FileName);
                uploads.Add(upload);
                FileList.Add(Files.CommitmentForm);
            }
            #endregion CommitmentForm

            #region MSATest
            if (Files.MSATest != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.MSATest + Files.MSATest.FileName);
                uploads.Add(upload);
                FileList.Add(Files.MSATest);
            }
            #endregion MSATest

            #region CriminalReport
            if (Files.CriminalReport != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.CriminalReport + Files.CriminalReport.FileName);
                uploads.Add(upload);
                FileList.Add(Files.CriminalReport);
            }
            #endregion CriminalReport

            #region AgiForm
            if (Files.AgiForm != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.AgiForm + Files.AgiForm.FileName);
                uploads.Add(upload);
                FileList.Add(Files.AgiForm);
            }
            #endregion AgiForm

            #region WorkSafety
            if (Files.WorkSafety != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.WorkSafety + Files.WorkSafety.FileName);
                uploads.Add(upload);
                FileList.Add(Files.WorkSafety);
            }
            #endregion WorkSafety

            #region D2Test
            if (Files.D2Test != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.D2Test + Files.D2Test.FileName);
                uploads.Add(upload);
                FileList.Add(Files.D2Test);
            }
            #endregion D2Test

            #region TaskDefinition
            if (Files.TaskDefinition != null)
            {
                var upload = Path.Combine(webRootPath, webRootPath + CreateFiles.TaskDefinition + Files.TaskDefinition.FileName);
                uploads.Add(upload);
                FileList.Add(Files.TaskDefinition);
            }
            #endregion TaskDefinition

            int i = 0;
            if (FileList.Count() > 0)
            {
                foreach (var item in FileList)
                {
                    using (var fileStream = new FileStream(Path.Combine(item.FileName), FileMode.Create))
                    {
                        item.CopyTo(fileStream);
                        
                        /*
                        var Document = new ProjectDocuments()
                        {
                            ProjectsId = ProjectVM.Id,
                            FileName = item.FileName + extension,
                            Length = item.Length
                        };
                        _uow.ProjectDocuments.Add(Document);*/
                    }
                    i++;
                }
            }


        }
    }
}
