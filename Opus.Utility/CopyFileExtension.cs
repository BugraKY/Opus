using Microsoft.AspNetCore.Http;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
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
        private readonly IUnitOfWork _uow;
        public CopyFileExtension(IUnitOfWork uow)
        {
            _uow = uow;
        }
        //private static readonly List<string> uploads;
        public void Upload(DocumentFilesVM Files, string webRootPath, Guid _guid, int staffId)
        {
            List<DocumentVM> _documents = new List<DocumentVM>();
            var Dir = webRootPath + Personels.Documentation + _guid.ToString();
            if (!(Directory.Exists(Dir)))
                Directory.CreateDirectory(Dir);

            //List<string> uploads = new List<string>();
            List<IFormFile> FileList = new List<IFormFile>();
            #region Identity
            if (Files.Identity != null)
            {
                FileList.Add(Files.Identity);
                var document = new DocumentVM()
                {
                    FormFile = Files.Identity,
                    DocumentTypeId = 2
                };
                _documents.Add(document);
            }
            #endregion Identity

            #region HealthReport
            if (Files.HealthReport != null)
            {
                FileList.Add(Files.HealthReport);
                var document = new DocumentVM()
                {
                    FormFile = Files.HealthReport,
                    DocumentTypeId = 13
                };
                _documents.Add(document);
            }
            #endregion HealthReport

            #region MilitaryStatus
            if (Files.MilitaryStatus != null)
            {
                FileList.Add(Files.MilitaryStatus);
                var document = new DocumentVM()
                {
                    FormFile = Files.MilitaryStatus,
                    DocumentTypeId = 5
                };
                _documents.Add(document);
            }
            #endregion MilitaryStatus

            #region Diploma
            if (Files.Diploma != null)
            {
                FileList.Add(Files.Diploma);
                var document = new DocumentVM()
                {
                    FormFile = Files.Diploma,
                    DocumentTypeId = 7
                };
                _documents.Add(document);
            }
            #endregion Diploma

            #region KVKKLaborAgreement
            if (Files.KVKKLaborAgreement != null) //KVKK İş Sözleşmesi Ek Metin
            {
                FileList.Add(Files.KVKKLaborAgreement);
                var document = new DocumentVM()
                {
                    FormFile = Files.KVKKLaborAgreement,
                    DocumentTypeId = 21
                };
                _documents.Add(document);
            }
            #endregion KVKKLaborAgreement

            #region OHSInstructionCommitmentForm
            if (Files.OHSInstructionCommitmentForm != null) //İSG Talimatı ve Taahhüt Formu
            {
                FileList.Add(Files.OHSInstructionCommitmentForm);
                var document = new DocumentVM()
                {
                    FormFile = Files.OHSInstructionCommitmentForm,
                    DocumentTypeId = 22
                };
                _documents.Add(document);
            }
            #endregion OHSInstructionCommitmentForm

            #region BloodType
            if (Files.BloodType != null)
            {
                FileList.Add(Files.BloodType);
                var document = new DocumentVM()
                {
                    FormFile = Files.BloodType,
                    DocumentTypeId = 12
                };
                _documents.Add(document);
            }
            #endregion BloodType

            #region DrivingLicence
            if (Files.DrivingLicence != null)
            {
                FileList.Add(Files.DrivingLicence);
                var document = new DocumentVM()
                {
                    FormFile = Files.DrivingLicence,
                    DocumentTypeId = 3
                };
                _documents.Add(document);
            }
            #endregion DrivingLicence

            #region PlaceResidence
            if (Files.PlaceResidence != null)
            {
                FileList.Add(Files.PlaceResidence);
                var document = new DocumentVM()
                {
                    FormFile = Files.PlaceResidence,
                    DocumentTypeId = 6
                };
                _documents.Add(document);
            }
            #endregion PlaceResidence

            #region TetanusVaccine
            if (Files.TetanusVaccine != null)
            {
                FileList.Add(Files.TetanusVaccine);
                var document = new DocumentVM()
                {
                    FormFile = Files.TetanusVaccine,
                    DocumentTypeId = 19
                };
                _documents.Add(document);
            }
            #endregion TetanusVaccine

            #region KVKKCommitmentReport
            if (Files.KVKKCommitmentReport != null) //KVKK Taahhüt Tutanağı
            {
                FileList.Add(Files.KVKKCommitmentReport);
                var document = new DocumentVM()
                {
                    FormFile = Files.KVKKCommitmentReport,
                    DocumentTypeId = 23
                };
                _documents.Add(document);
            }
            #endregion KVKKCommitmentReport

            #region InternalRegulation
            if (Files.InternalRegulation != null) //İç Yönetmenlik
            {
                FileList.Add(Files.InternalRegulation);
                var document = new DocumentVM()
                {
                    FormFile = Files.InternalRegulation,
                    DocumentTypeId = 24
                };
                _documents.Add(document);
            }
            #endregion InternalRegulation

            #region Insurance
            if (Files.Insurance != null)
            {
                FileList.Add(Files.Insurance);
                var document = new DocumentVM()
                {
                    FormFile = Files.Insurance,
                    DocumentTypeId = 1
                };
                _documents.Add(document);
            }
            #endregion Insurance

            #region BusinessArrangement
            if (Files.BusinessArrangement != null)
            {
                FileList.Add(Files.BusinessArrangement);
                var document = new DocumentVM()
                {
                    FormFile = Files.BusinessArrangement,
                    DocumentTypeId = 8
                };
                _documents.Add(document);
            }
            #endregion BusinessArrangement

            #region Overtime
            if (Files.Overtime != null)
            {
                FileList.Add(Files.Overtime);
                var document = new DocumentVM()
                {
                    FormFile = Files.Overtime,
                    DocumentTypeId = 10
                };
                _documents.Add(document);
            }
            #endregion Overtime

            #region CommitmentForm
            if (Files.CommitmentForm != null)
            {
                FileList.Add(Files.CommitmentForm);
                var document = new DocumentVM()
                {
                    FormFile = Files.CommitmentForm,
                    DocumentTypeId = 14
                };
                _documents.Add(document);
            }
            #endregion CommitmentForm

            #region CriminalReport
            if (Files.CriminalReport != null)
            {
                FileList.Add(Files.CriminalReport);
                var document = new DocumentVM()
                {
                    FormFile = Files.CriminalReport,
                    DocumentTypeId = 4
                };
                _documents.Add(document);
            }
            #endregion CriminalReport

            #region AgiForm
            if (Files.AgiForm != null)
            {
                FileList.Add(Files.AgiForm);
                var document = new DocumentVM()
                {
                    FormFile = Files.AgiForm,
                    DocumentTypeId = 9
                };
                _documents.Add(document);
            }
            #endregion AgiForm

            #region WorkSafety
            if (Files.WorkSafety != null)
            {
                FileList.Add(Files.WorkSafety);
                var document = new DocumentVM()
                {
                    FormFile = Files.WorkSafety,
                    DocumentTypeId = 11
                };
                _documents.Add(document);
            }
            #endregion WorkSafety

            #region D2Test
            if (Files.D2Test != null)
            {
                FileList.Add(Files.D2Test);
                var document = new DocumentVM()
                {
                    FormFile = Files.D2Test,
                    DocumentTypeId = 15
                };
                _documents.Add(document);
            }
            #endregion D2Test

            #region TaskDefinition
            if (Files.TaskDefinition != null)
            {
                FileList.Add(Files.TaskDefinition);
                var document = new DocumentVM()
                {
                    FormFile = Files.TaskDefinition,
                    DocumentTypeId = 18
                };
                _documents.Add(document);
            }
            #endregion TaskDefinition

            int i = 0;
            if (_documents.Count() > 0)
            {
                foreach (var item in _documents)
                {
                    string[] Name = item.FormFile.Name.Split('.');
                    var _fileName = Name[1] + Path.GetExtension(item.FormFile.FileName);
                    var location = Path.Combine(webRootPath + @"\assets\personels\documentations\" + _guid + @"\" + _fileName);

                    using (var fileStream = new FileStream(location, FileMode.Create))
                    {
                        //item.FormFile.CopyTo(fileStream);
                    }
                    var _documentItem = new Documents
                    {
                        Active = true,
                        DocumentTypeId = item.DocumentTypeId,
                        FileName = _fileName,
                        StaffId = staffId,
                        Created = DateTime.Now
                    };
                    _uow.Documents.Add(_documentItem);
                    i++;
                }
                _uow.Save();
            }


        }
    }
}
