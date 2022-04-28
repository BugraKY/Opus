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
using static System.Net.Mime.MediaTypeNames;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

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
        public void Upload(DocumentFilesVM Files, string webRootPath, string _guid, int staffId,string _base64)
        {
            List<DocumentVM> _documents = new List<DocumentVM>();
            var DIR_PerDoc = webRootPath + Personels.Root + _guid.ToString() + Personels.Documentation;
            var DIR_ProfileIMG = webRootPath + Personels.Root + _guid.ToString() + Personels.ProfileIMG;
            if (!(Directory.Exists(DIR_PerDoc)))
                Directory.CreateDirectory(DIR_PerDoc);
            if (!(Directory.Exists(DIR_ProfileIMG)))
                Directory.CreateDirectory(DIR_ProfileIMG);

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
                    var location = Path.Combine(DIR_PerDoc + _fileName);

                    using (var fileStream = new FileStream(location, FileMode.Create))
                    {
                        item.FormFile.CopyTo(fileStream);
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
            if (Files.ImageFile != null)
            {
                var _fileName = Files.ImageFile.FileName;
                var location = Path.Combine(DIR_ProfileIMG + _fileName);

                Bitmap _image = LoadBase64(_base64);

                using (var fileStream = new FileStream(location, FileMode.Create))
                {
                    Files.ImageFile.CopyTo(fileStream);
                }
            }

        }

        public void Upload_UPSERT(DocumentFilesVM Files, DocumentFilesReadVM _docs, string webRootPath, string _guid, int staffId,string _base64)
        {
            List<DocumentVM> _documents = new List<DocumentVM>();
            var DIR_PerDoc = webRootPath + Personels.Root + _guid.ToString() + Personels.Documentation;
            var DIR_ProfileIMG = webRootPath + Personels.Root + _guid.ToString() + Personels.ProfileIMG;
            if (!(Directory.Exists(DIR_PerDoc)))
                Directory.CreateDirectory(DIR_PerDoc);
            if (!(Directory.Exists(DIR_ProfileIMG)))
                Directory.CreateDirectory(DIR_ProfileIMG);
            #region Base
            //List<string> uploads = new List<string>();
            List<IFormFile> FileList = new List<IFormFile>();
            #region Identity
            if (_docs.Identity != null)
            {
                FileList.Add(_docs.Identity.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.Identity.File,
                    DocumentId = _docs.Identity.Id,
                    DocumentTypeId = 2
                };
                _documents.Add(document);
            }
            #endregion Identity

            #region HealthReport
            if (_docs.HealthReport != null)
            {
                FileList.Add(_docs.HealthReport.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.HealthReport.File,
                    DocumentId = _docs.HealthReport.Id,
                    DocumentTypeId = 13
                };
                _documents.Add(document);
            }
            #endregion HealthReport

            #region MilitaryStatus
            if (_docs.MilitaryStatus != null)
            {
                FileList.Add(_docs.MilitaryStatus.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.MilitaryStatus.File,
                    DocumentId = _docs.MilitaryStatus.Id,
                    DocumentTypeId = 5
                };
                _documents.Add(document);
            }
            #endregion MilitaryStatus

            #region Diploma
            if (_docs.Diploma != null)
            {
                FileList.Add(_docs.Diploma.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.Diploma.File,
                    DocumentId = _docs.Diploma.Id,
                    DocumentTypeId = 7
                };
                _documents.Add(document);
            }
            #endregion Diploma

            #region KVKKLaborAgreement
            if (_docs.KVKKLaborAgreement != null) //KVKK İş Sözleşmesi Ek Metin
            {
                FileList.Add(_docs.KVKKLaborAgreement.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.KVKKLaborAgreement.File,
                    DocumentId= _docs.KVKKLaborAgreement.Id,
                    DocumentTypeId = 21
                };
                _documents.Add(document);
            }
            #endregion KVKKLaborAgreement

            #region OHSInstructionCommitmentForm
            if (_docs.OHSInstructionCommitmentForm != null) //İSG Talimatı ve Taahhüt Formu
            {
                FileList.Add(_docs.OHSInstructionCommitmentForm.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.OHSInstructionCommitmentForm.File,
                    DocumentId=_docs.OHSInstructionCommitmentForm.Id,
                    DocumentTypeId = 22
                };
                _documents.Add(document);
            }
            #endregion OHSInstructionCommitmentForm

            #region BloodType
            if (_docs.BloodType != null)
            {
                FileList.Add(_docs.BloodType.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.BloodType.File,
                    DocumentId = _docs.BloodType.Id,
                    DocumentTypeId = 12
                };
                _documents.Add(document);
            }
            #endregion BloodType

            #region DrivingLicence
            if (_docs.DrivingLicence != null)
            {
                FileList.Add(_docs.DrivingLicence.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.DrivingLicence.File,
                    DocumentId= _docs.DrivingLicence.Id,
                    DocumentTypeId = 3
                };
                _documents.Add(document);
            }
            #endregion DrivingLicence

            #region PlaceResidence
            if (_docs.PlaceResidence != null)
            {
                FileList.Add(_docs.PlaceResidence.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.PlaceResidence.File,
                    DocumentId = _docs.PlaceResidence.Id,
                    DocumentTypeId = 6
                };
                _documents.Add(document);
            }
            #endregion PlaceResidence

            #region TetanusVaccine
            if (_docs.TetanusVaccine != null)
            {
                FileList.Add(_docs.TetanusVaccine.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.TetanusVaccine.File,
                    DocumentId=_docs.TetanusVaccine.Id,
                    DocumentTypeId = 19
                };
                _documents.Add(document);
            }
            #endregion TetanusVaccine

            #region KVKKCommitmentReport
            if (_docs.KVKKCommitmentReport != null) //KVKK Taahhüt Tutanağı
            {
                FileList.Add(_docs.KVKKCommitmentReport.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.KVKKCommitmentReport.File,
                    DocumentId= _docs.KVKKCommitmentReport.Id,
                    DocumentTypeId = 23
                };
                _documents.Add(document);
            }
            #endregion KVKKCommitmentReport

            #region InternalRegulation
            if (_docs.InternalRegulation != null) //İç Yönetmenlik
            {
                FileList.Add(_docs.InternalRegulation.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.InternalRegulation.File,
                    DocumentId = _docs.InternalRegulation.Id,
                    DocumentTypeId = 24
                };
                _documents.Add(document);
            }
            #endregion InternalRegulation

            #region Insurance
            if (_docs.Insurance != null)
            {
                FileList.Add(_docs.Insurance.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.Insurance.File,
                    DocumentId=_docs.Insurance.Id,
                    DocumentTypeId = 1
                };
                _documents.Add(document);
            }
            #endregion Insurance

            #region BusinessArrangement
            if (_docs.BusinessArrangement != null)
            {
                FileList.Add(_docs.BusinessArrangement.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.BusinessArrangement.File,
                    DocumentId = _docs.BusinessArrangement.Id,
                    DocumentTypeId = 8
                };
                _documents.Add(document);
            }
            #endregion BusinessArrangement

            #region Overtime
            if (_docs.Overtime != null)
            {
                FileList.Add(_docs.Overtime.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.Overtime.File,
                    DocumentId= _docs.Overtime.Id,
                    DocumentTypeId = 10
                };
                _documents.Add(document);
            }
            #endregion Overtime

            #region CommitmentForm
            if (_docs.CommitmentForm != null)
            {
                FileList.Add(_docs.CommitmentForm.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.CommitmentForm.File,
                    DocumentId = _docs.CommitmentForm.Id,
                    DocumentTypeId = 14
                };
                _documents.Add(document);
            }
            #endregion CommitmentForm

            #region CriminalReport
            if (_docs.CriminalReport != null)
            {
                FileList.Add(_docs.CriminalReport.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.CriminalReport.File,
                    DocumentId=_docs.CriminalReport.Id,
                    DocumentTypeId = 4
                };
                _documents.Add(document);
            }
            #endregion CriminalReport

            #region AgiForm
            if (_docs.AgiForm != null)
            {
                FileList.Add(_docs.AgiForm.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.AgiForm.File,
                    DocumentId = _docs.AgiForm.Id,
                    DocumentTypeId = 9
                };
                _documents.Add(document);
            }
            #endregion AgiForm

            #region WorkSafety
            if (_docs.WorkSafety != null)
            {
                FileList.Add(_docs.WorkSafety.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.WorkSafety.File,
                    DocumentId= _docs.WorkSafety.Id,
                    DocumentTypeId = 11
                };
                _documents.Add(document);
            }
            #endregion WorkSafety

            #region D2Test
            if (_docs.D2Test != null)
            {
                FileList.Add(_docs.D2Test.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.D2Test.File,
                    DocumentId = _docs.D2Test.Id,
                    DocumentTypeId = 15
                };
                _documents.Add(document);
            }
            #endregion D2Test

            #region TaskDefinition
            if (_docs.TaskDefinition != null)
            {
                FileList.Add(_docs.TaskDefinition.File);
                var document = new DocumentVM()
                {
                    FormFile = _docs.TaskDefinition.File,
                    DocumentId=_docs.TaskDefinition.Id,
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
                    if(item.FormFile != null)
                    {
                        string[] Name = item.FormFile.Name.Split('.');
                        var _fileName = Name[1] + Path.GetExtension(item.FormFile.FileName);
                        var location = Path.Combine(DIR_PerDoc + _fileName);


                        if (item.DocumentId == 0)
                        {
                            var _documentItem = new Documents
                            {
                                Id = item.DocumentId,
                                Active = true,
                                DocumentTypeId = item.DocumentTypeId,
                                FileName = _fileName,
                                StaffId = staffId,
                                Created = DateTime.Now
                            };
                            _uow.Documents.Add(_documentItem);
                        }
                        else
                        {
                            var _documentItem = new Documents
                            {
                                Id = item.DocumentId,
                                Active = true,
                                DocumentTypeId = item.DocumentTypeId,
                                FileName = _fileName,
                                StaffId = staffId,
                                Created = DateTime.Now
                            };
                            var _filenameget = _uow.Documents.GetFirstOrDefault(i=>i.Id== item.DocumentId).FileName;
                            var _documentFileLoc= Path.Combine(DIR_PerDoc + _filenameget);

                            if (File.Exists(_documentFileLoc))
                                File.Delete(_documentFileLoc);
                            _uow.Documents.Update(_documentItem);
                        }

                        using (var fileStream = new FileStream(location, FileMode.Create))
                        {
                            item.FormFile.CopyTo(fileStream);
                        }
                        i++;
                    }

                }
                _uow.Save();
            }
            #endregion Base
            if (Files.ImageFile != null)
            {
                var _fileName = Files.ImageFile.FileName;
                var location = Path.Combine(DIR_ProfileIMG + _fileName);
                var _oldImageFile=_uow.Staff.GetFirstOrDefault(i=>i.Id== staffId).ImageFile;
                var location_old= Path.Combine(DIR_ProfileIMG + _oldImageFile);

                var _image = LoadBase64(_base64);
                /*
                if (File.Exists(location_old))
                    File.Delete(location_old);

                using (var fileStream = new FileStream(location, FileMode.Create))
                {
                    Files.ImageFile.CopyTo(fileStream);
                }*/

            }

        }

        public static Bitmap LoadBase64(string base64)
        {
            byte[] bytes = Convert.FromBase64String(base64);
            Bitmap image;
            using (MemoryStream ms = new MemoryStream(bytes))
            {
                image = (Bitmap)Bitmap.FromStream(ms);
            }
            return image;
        }
    }
}
