using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Opus.Utility.ProjectConstant;
using System.Data;
using Opus.DataAcces.IMainRepository;
using Microsoft.Extensions.Hosting;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using Opus.Utility;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class PersonMotionController : Controller
    {
        private readonly IUnitOfWork _uow;

        public PersonMotionController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [Route("person-motion")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible)]
        public IActionResult Index()
        {

            //List<Staff> staffs = new List<Staff>();
            //var staffStamp = _uow.StaffStamp.GetAll(i => i.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000"));
            var staffStamp = _uow.StaffStamp.GetAll(includeProperties: "Staff,Stamp");
            var timeekeeping = _uow.TimeKeeping.GetAll().Where(i => (i.Year == DateTime.Now.Year && i.Month == 8));
            var activeStaff = _uow.Staff.GetAll(i => (i.Status == 1 && i.Active));//activestaff ve timekeeping ile beraber countları karşılaştırılıp aylık bazında time keeping kayıtları eklenilebilir. Test edilmedi.!!!!

            /*
            var orn = _uow.Staff.GetAll()
                .Join(staffStamp,
                s => s.Id,
                r => r.StaffId,
                (s, r) => new { staffs = s, staffStamp = r })
                .Where(i => (i.staffs.Active && i.staffs.Status == 1 && i.staffStamp.Stamp.Lost == 0 && i.staffStamp.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000")))
                .Select(s => s.staffStamp)
                .OrderBy(n => n.Staff.FirstName);
            */

            /*
            var orn = _uow.StaffStamp.GetAll(includeProperties: "Staff,Stamp").Where(i => (i.Staff.Active && i.Staff.BlackList == false &&
            i.Staff.WhiteCollarWorker == false && i.Staff.Status == 1 && i.Stamp.Lost == 0 && i.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000"))).OrderBy(n => n.Stamp.Id);
            */
            /*
            var test = _uow.StaffStamp.GetAll(includeProperties: "Staff,Stamp").Where(i => (i.Staff.Active && i.Staff.BlackList == false &&
            i.Staff.WhiteCollarWorker == false && i.Staff.Status == 1 && i.Stamp.Lost == 0 && i.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000"))).OrderBy(n => n.Stamp.Id);
            */

            //var _persMotion = new PersonMotionVM();

            //WORKING SOME
            
            var personmotionAnonymous = _uow.StaffStamp.GetAll(includeProperties: "Staff,Stamp").Where(i => (i.Staff.Active && i.Staff.BlackList == false &&
            i.Staff.Status == 1 && i.Stamp.Lost == 0 && i.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000")))
                .Join(timeekeeping,
                s => s.StaffId,
                r => r.StaffId,
                (s, r) => new { staffStamp = s, timeKeeping = r })
                .Where(i => i.staffStamp.StaffId == i.timeKeeping.StaffId)
                .OrderBy(n => n.staffStamp.Staff.FirstName);
            
            /*
            var personmotionAnonymous = _uow.StaffStamp.GetAll(includeProperties: "Staff,Stamp").Where(i => (i.Staff.Active && i.Staff.BlackList == false &&
            i.Staff.Status == 1 && i.Stamp.Lost == 0 && i.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000")))
                .Join(timeekeeping,
                s => s.StaffId,
                r => r.StaffId,
                (s, r) => new { staffStamp = s, timeKeeping = r })
                .Where(i => i.staffStamp.StaffId == i.timeKeeping.StaffId)
                .OrderBy(n => n.staffStamp.Staff.FirstName);*/

            //CheckTimeKeeping();



            IEnumerable<PersonMotionVM> _personMotion = null;
            switch ((Enums.TimeKeeping)DateTime.Now.Day)
            {
                case Enums.TimeKeeping.D01:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D01
                    });
                    break;
                case Enums.TimeKeeping.D02:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D02
                    });
                    break;
                case Enums.TimeKeeping.D03:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D03
                    });
                    break;
                case Enums.TimeKeeping.D04:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D04
                    });
                    break;
                case Enums.TimeKeeping.D05:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D05
                    });
                    break;
                case Enums.TimeKeeping.D06:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D06
                    });
                    break;
                case Enums.TimeKeeping.D07:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D07
                    });
                    break;
                case Enums.TimeKeeping.D08:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D08
                    });
                    break;
                case Enums.TimeKeeping.D09:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D09
                    });
                    break;
                case Enums.TimeKeeping.D10:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D10
                    });
                    break;
                case Enums.TimeKeeping.D11:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D11
                    });
                    break;
                case Enums.TimeKeeping.D12:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D12
                    });
                    break;
                case Enums.TimeKeeping.D13:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D13
                    });
                    break;
                case Enums.TimeKeeping.D14:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D14
                    });
                    break;
                case Enums.TimeKeeping.D15:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D15
                    });
                    break;
                case Enums.TimeKeeping.D16:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D16
                    });
                    break;
                case Enums.TimeKeeping.D17:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D17
                    });
                    break;
                case Enums.TimeKeeping.D18:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D18
                    });
                    break;
                case Enums.TimeKeeping.D19:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D19
                    });
                    break;
                case Enums.TimeKeeping.D20:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D20
                    });
                    break;
                case Enums.TimeKeeping.D21:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D21
                    });
                    break;
                case Enums.TimeKeeping.D22:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D22
                    });
                    break;
                case Enums.TimeKeeping.D23:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D23
                    });
                    break;
                case Enums.TimeKeeping.D24:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D24
                    });
                    break;
                case Enums.TimeKeeping.D25:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D25
                    });
                    break;
                case Enums.TimeKeeping.D26:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D26
                    });
                    break;
                case Enums.TimeKeeping.D27:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D27
                    });
                    break;
                case Enums.TimeKeeping.D28:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D28
                    });
                    break;
                case Enums.TimeKeeping.D29:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D29
                    });
                    break;
                case Enums.TimeKeeping.D30:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D30
                    });
                    break;
                case Enums.TimeKeeping.D31:
                    _personMotion = personmotionAnonymous.Select(x => new PersonMotionVM
                    {
                        TimeKeeping = x.timeKeeping,
                        StaffStamp = x.staffStamp,
                        Today = x.timeKeeping.D31
                    });
                    break;
                default:
                    break;
            }

            var _locations = _uow.Location.GetAll();
            var _motion = _uow.Staff.GetAll(i => (i.Status == 1 && i.Active && i.BlackList == false));
            //result = 131


            return View(_personMotion);
        }
        public bool CheckTimeKeeping()
        {
            new Thread(() =>
            {
                //Thread.CurrentThread.IsBackground = true;
                try
                {
                    var _TKQuery = new List<TimeKeeping>();
                    int eklenmeyenler = 0;
                    int eklenenler = 0;
                    var activestaff = _uow.Staff.GetAll(i => (i.Status == 1 && i.Active)).ToList();
                    foreach (var item in activestaff)
                    {
                        //var _timekeepingQuery = _uow.TimeKeeping.GetFirstOrDefault(i => (i.StaffId == item.Id && i.Month == DateTime.Now.Month && i.Year == DateTime.Now.Year));
                        var _timekeepingQuery = _uow.TimeKeeping.GetFirstOrDefault(i => (i.StaffId == item.Id && i.Month == 8 && i.Year == DateTime.Now.Year));
                        if (_timekeepingQuery != null)
                        {
                            eklenenler++;

                        }
                        else
                        {
                            eklenmeyenler++;
                            var _TK = new TimeKeeping
                            {
                                Month = DateTime.Now.Month,
                                Year = DateTime.Now.Year,
                                StaffId = item.Id
                            };
                            _TKQuery.Add(_TK);
                        }
                    }

                    if (_TKQuery.Count > 0)
                        _uow.TimeKeeping.AddRange(_TKQuery);

                    Console.WriteLine("");
                    Console.WriteLine("eklenenler: " + eklenenler.ToString());
                    Console.WriteLine("eklenmeyenler: " + eklenmeyenler.ToString());
                    Console.WriteLine("personeller: " + activestaff.Count().ToString());
                    Console.WriteLine("");
                    Console.WriteLine("---------------------------------------------------------------");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("");
                    Console.WriteLine("EROOR: ");
                    Console.WriteLine(ex.Message.ToString());
                }

            }).Start();
            return true;
        }

    }
}
