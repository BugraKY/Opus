using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.CodeAnalysis.Differencing;
using Opus.DataAcces.IMainRepository;
using Opus.Extensions;
using Opus.Hubs;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using static Opus.Utility.ProjectConstant;
using static System.Net.Mime.MediaTypeNames;

namespace Opus.Api
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/hr")]

    public class HRController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        protected IHubContext<OpusHub> _context;
        int PassLength = 0;
        StringBuilder res;
        public HRController(IUnitOfWork uow, IHubContext<OpusHub> context)
        {
            _uow = uow;
            _context = context;
        }
        [HttpPost()]
        [Route("get-staff-active")]
        public async Task<IEnumerable<Staff>> GetStaffActive()
        {
            return await Task.Run(() =>
            {
                return _uow.Staff.GetAll().OrderBy(n => n.FirstName).Where(i => (i.Active && i.Status == 1));
            });
            //return null;
        }
        [HttpPost()]
        [Route("get-staff-withpassive")]
        public async Task<IEnumerable<Staff>> GetStaffWithActive()
        {
            return await Task.Run(() =>
            {
                return _uow.Staff.GetAll().OrderBy(n => n.FirstName).Where(i => (i.Active));
            });
            //return null;
        }
        [HttpPost()]
        [Route("get-location")]
        public async Task<IEnumerable<Location>> GetLocation()
        {
            return await Task.Run(() =>
            {
                return _uow.Location.GetAll().OrderBy(n => n.Name).Where(i => (i.Active));
            });
            //return null;
        }
        [HttpPost()]
        [Route("get-trainer")]
        public async Task<IEnumerable<Trainer>> GetTrainer()
        {
            return await Task.Run(() =>
            {
                return _uow.Trainer.GetAll(includeProperties: "Location").OrderBy(n => n.FullName);
            });
            //return null;
        }
        [HttpGet()]
        [Route("list-training")]
        public async Task<IEnumerable<Training>> GetListTraining()
        {
            return await Task.Run(() =>
            {
                return _uow.Training.GetAll(includeProperties: "Location,References,Trainer").OrderBy(s => s.Subject);
            });
            //return null;
        }
        [HttpPost()]
        [Route("get-reference-locid/{locationid}")]
        public async Task<IEnumerable<References>> GetReferenceBylocid(long locationid)
        {
            return await Task.Run(() =>
            {
                return _uow.References.GetAll(i => i.LocationId == locationid, includeProperties: "Location");
            });
            //return null;
        }
        [HttpGet()]
        [Route("get-references")]
        public async Task<IEnumerable<References>> GetReferences()
        {
            return await Task.Run(() =>
            {
                return _uow.References.GetAll(includeProperties: "Location,Company");
            });
            //return null;
        }
        [HttpGet()]
        [Route("get-companies/{id}")]
        public async Task<IEnumerable<Company>> GetCompanies(long id)
        {
            return await Task.Run(() =>
            {
                return _uow.Company.GetAll(i => i.LocationId == id, includeProperties: "Location");
            });
            //return null;
        }
        [HttpGet()]
        [Route("get-companies-all")]
        public async Task<IEnumerable<Company>> GetCompaniesAll()
        {
            return await Task.Run(() =>
            {
                return _uow.Company.GetAll(includeProperties: "Location");
            });
            //return null;
        }
        [HttpPost()]
        [Route("add-trainer")]
        public async Task<ToastMessageVM> AddTrainer([FromBody] Trainer _trainer)
        {
            var trainer = _uow.Trainer.GetAll(i => i.FullName == _trainer.FullName, includeProperties: "Location").OrderBy(n => n.FullName).Count();

            if (trainer == 0)
            {
                return await Task.Run(() =>
                {
                    try
                    {
                        _uow.Trainer.Add(_trainer);
                        _uow.Save();
                        var _toast = new ToastMessageVM()
                        {
                            Message = "success",
                            Header = "Status",
                            Icon = "Success",
                            HideAfter = 0
                        };
                        return _toast;
                    }
                    catch (Exception ex)
                    {
                        var _toast = new ToastMessageVM()
                        {
                            Message = ex.Message,
                            Header = "Fail",
                            Icon = "danger",
                            HideAfter = 0
                        };
                        return _toast;
                    }

                });
            }

            var _toast = new ToastMessageVM()
            {
                Message = "This trainer already added before",
                Header = "Status",
                Icon = "warning",
                HideAfter = 0
            };
            return _toast;

            //return null;
        }

        [HttpPost()]
        [Route("add-Reference")]
        public async Task<ToastMessageVM> AddReference([FromBody] References _reference)
        {
            var reference = _uow.References.GetAll(i => i.Reference == _reference.Reference).Count();

            if (reference == 0)
            {
                return await Task.Run(() =>
                {
                    try
                    {
                        _uow.References.Add(_reference);
                        _uow.Save();
                        var _toast = new ToastMessageVM()
                        {
                            Message = "success",
                            Header = "Status",
                            Icon = "Success",
                            HideAfter = 0
                        };
                        return _toast;
                    }
                    catch (Exception ex)
                    {
                        var _toast = new ToastMessageVM()
                        {
                            Message = ex.Message,
                            Header = "Fail",
                            Icon = "danger",
                            HideAfter = 0
                        };
                        return _toast;
                    }

                });
            }

            var _toast = new ToastMessageVM()
            {
                Message = "This trainer already added before",
                Header = "Status",
                Icon = "warning",
                HideAfter = 0
            };
            return _toast;

            //return null;
        }
        [HttpPost()]
        [Route("staff-user-add")]
        public async Task<IEnumerable<Staff>> AddStaffUserPost([FromBody] Staff user)
        {

            return await Task.Run(() =>
            {
                var _staff = _uow.Staff.GetFirstOrDefault(i => i.Id == user.Id);
                if (_staff != null)
                {
                    _staff.Auth = user.Auth;
                    _staff.AppUser = user.AppUser;
                    _staff.AppPassword = user.AppPassword;
                    _staff.IsUser = true;
                }
                _uow.Staff.Update(_staff);
                _uow.Save();
                return _uow.Staff.GetAll().Where(a => (a.Active && a.Status == 1 && a.IsUser));
            });
        }
        [HttpGet()]
        [Route("staff-user-added")]
        public async Task<IEnumerable<Staff>> GetAddedStaffUser()
        {
            return await Task.Run(() =>
            {
                return _uow.Staff.GetAll().Where(a => (a.Active && a.Status == 1 && a.IsUser));
            });
        }
        [HttpGet]
        [Route("staff-user-non-added")]
        public async Task<IEnumerable<Staff>> GetNonAddedStaffUser()
        {
            return await Task.Run(() =>
            {
                return _uow.Staff.GetAll().Where(a => (a.Active && a.Status == 1 && a.IsUser == false)).
                OrderBy(n => n.FirstName);
            });
        }
        [HttpPost]
        [Route("generate-pass")]
        public string GeneratePassword([FromBody] string key)
        {
            PassLength = 8;
            /*
            var _password = "";
            if (key == "vasd7564as52d9c7s")
            {
                _password = Guid.NewGuid().ToString().Replace("-", "").Substring(1,6);
            }
            return _password;
            */
            if (key == "vasd7564as52d9c7s")
            {
                ResLoopback();
            }
            return res.ToString();
        }
        [HttpPost]
        [Route("generate-username")]
        public string GenerateUserName([FromBody] string FullName)
        {
            var multiwords = FullName.ToLower().Replace('ı', 'i').Replace('ğ', 'g').Replace('ü', 'u').Replace('ş', 's').Replace('ö', 'o').Replace('ç', 'c').Replace(' ', '.').Split('.');
            return multiwords.First() + "." + multiwords.Last();
        }

        public void ResLoopback()
        {
            res = new StringBuilder();
            const string valid = "a0A1b2B3c4C5d6D7e8E9f0F1g2G3h4H5i6I7j8J9k0K1m2M3n4N567p8P9q0Q1r2R3s4S5t6T7u8U9v0V1w2W3x4X5y6Y7z8Z9";
            int length = PassLength;
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            int z = 0;
            for (int i = 0; i < res.Length; i++)
            {
                if (Char.IsDigit(res[i]))
                    z++;
            }
            //var matches = Regex.Matches(res.ToString(), @"(.)\1+");
            var Matches = res.ToString().GroupBy(c => c).Where(c => c.Count() > 1).Select(c => new { charName = c.Key, charCount = c.Count() });
            var UpperString = res.ToString().Count(char.IsUpper);
            var LowerString = res.ToString().Count(char.IsLower);
            //Console.WriteLine("Number Counted: " + z);
            if (z != (PassLength / 2) || Matches.Count() > 0 || (UpperString > (PassLength / 2)/2) || (LowerString > (PassLength / 2) / 2))
            {
                if (Matches.Count() > 0)
                {
                    foreach (var match in Matches)
                    {
                        Console.WriteLine("Tekrarlayan: " + match.ToString());
                    }
                }
                if((UpperString > (PassLength / 2) / 2) || (LowerString > (PassLength / 2) / 2))
                    Console.WriteLine("UYUŞMAYAN KARAKTER SAYISI: Büyük Karakter Sayısı: " + UpperString + " - Küçük Karakter Sayısı: " + LowerString);
                ResLoopback();
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.DarkGreen;
                Console.WriteLine("Güvenli şifre oluşturuldu! - " + "'"+res.ToString() +"'"+ " Büyük Karakter Sayısı: " + UpperString + " - Küçük Karakter Sayısı: " + LowerString);
                Console.ForegroundColor = ConsoleColor.White;

                Console.WriteLine("\n");
                Console.WriteLine("-------------------------------------------------------------");
                Console.WriteLine("\n");
                //SMTPExtension.SENDMAIL();
                //SendSMSExtension.SEND();
                //SendSMSExtension.TestASPSMSAsync();
            }

            //const var numbers = Regex.Match(res, @"\d+").Value;
        }
        /*
        [HttpPost()]
        [Route("remove-trainer")]
        public async Task<ToastMessageVM> RemoveTrainer(string id)
        {
            var _trainer = _uow.Trainer.GetFirstOrDefault(i => i.Id == Guid.Parse(id));
        }*/
    }
}
