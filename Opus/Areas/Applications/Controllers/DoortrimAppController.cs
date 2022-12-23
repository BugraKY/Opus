using Microsoft.AspNetCore.Mvc;
using Opus.DataAcces.IMainRepository;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using System.Text;
using static Opus.Utility.ProjectConstant;
using static Opus.Utility.ProjectConstant.ApplicationsConstant;

namespace Opus.Areas.Applications.Controllers
{
    [Area("Applications")]
    public class DoortrimAppController : Controller
    {
        private readonly IUnitOfWork _uow;
        private readonly IWebHostEnvironment _hostEnvironment;
        StringBuilder res;
        int PassLength;
        public DoortrimAppController(IUnitOfWork uow, IWebHostEnvironment hostEnvironment)
        {
            _uow = uow;
            _hostEnvironment = hostEnvironment;
        }
        [Route("app-doortrim")]
        public IActionResult Index()
        {
            //var users = _uow.ApiUser.GetAll(i => i.ApplicationUser.Active && i.UserType == "doortrim");
            return View();
        }
        [Route("app-doortrim/add-user")]
        public IActionResult AddUser()
        {
            var staff = _uow.Staff.GetAll(i => (i.Active && i.Status == 1)).OrderBy(x => x.FirstName).ThenBy(x => x.LastName);
            return View(staff);
        }
        [Route("api/app-doortrim/add-user")]
        [HttpPost]
        public ToastMessageVM AddUserPost([FromBody] ApiUser data)
        {
            var ToastMessage = new ToastMessageVM();
            try
            {
                var status = _uow.ApiUser.GetFirstOrDefault(i => i.UserName == data.UserName);
                if (status == null)
                {
                    data.UserType = APPCONSTYPES.DoorTrimn;
                    _uow.ApiUser.Add(data);
                    _uow.Save();
                    ToastMessage = new ToastMessageVM
                    {
                        HideAfter = 5000,
                        Header = "User added",
                        Icon = "success",
                        Message = "The user has been successfully. You can see details in list.",
                        ShowHideTransition = "slide"
                    };
                }
                else
                {
                    ToastMessage = new ToastMessageVM
                    {
                        HideAfter = 5000,
                        Header = "Fail",
                        Icon = "warning",
                        Message = "This user allready added before",
                        ShowHideTransition = "slide"
                    };
                }
            }
            catch (Exception ex)
            {
                ToastMessage = new ToastMessageVM
                {
                    HideAfter = 5000,
                    Header = "Fail",
                    Icon = "alert",
                    Message = "ERROR: "+ex.Message,
                    ShowHideTransition = "slide"
                };
                return ToastMessage;
            }
            return ToastMessage;
        }
        [Route("api/app-doortrim/get-users")]
        [HttpGet]
        public IEnumerable<ApiUser> GetUsers()
        {
            return _uow.ApiUser.GetAll(x => (
            x.UserType == APPCONSTYPES.DoorTrimn &&
            x.Staff.Active &&
            x.Staff.Status == 1),
            includeProperties: "Staff").
            OrderBy(x => x.Staff.FirstName).
            OrderBy(x => x.Staff.LastName);
        }
        [Route("api/app-doortrim/get-staff")]
        [HttpGet]
        public async Task<IEnumerable<Staff>> GetStaffNonAdded()
        {
            return await Task.Run(() =>
            {
                return _uow.Staff.GetAll(x => (x.Active && x.Status == 1)).OrderBy(x => x.FirstName).ThenBy(x => x.LastName);
            });
        }
        [Route("app-doortrim/update-user")]
        public IActionResult UpdateUser()
        {
            return View();
        }
        [HttpPost]
        [Route("api/app-doortrim/generate-pass")]
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
        [Route("api/app-doortrim/generate-username")]
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
            if (z != (PassLength / 2) || Matches.Count() > 0 || (UpperString > (PassLength / 2) / 2) || (LowerString > (PassLength / 2) / 2))
            {
                if (Matches.Count() > 0)
                {
                    foreach (var match in Matches)
                    {
                        Console.WriteLine("Tekrarlayan: " + match.ToString());
                    }
                }
                if ((UpperString > (PassLength / 2) / 2) || (LowerString > (PassLength / 2) / 2))
                    Console.WriteLine("UYUŞMAYAN KARAKTER SAYISI: Büyük Karakter Sayısı: " + UpperString + " - Küçük Karakter Sayısı: " + LowerString);
                ResLoopback();
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.DarkGreen;
                Console.WriteLine("Güvenli şifre oluşturuldu! - " + "'" + res.ToString() + "'" + " Büyük Karakter Sayısı: " + UpperString + " - Küçük Karakter Sayısı: " + LowerString);
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
    }
}
