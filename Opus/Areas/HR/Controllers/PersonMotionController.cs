using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Opus.Utility.ProjectConstant;
using System.Data;
using Opus.DataAcces.IMainRepository;
using Microsoft.Extensions.Hosting;
using Opus.Models.DbModels;
using Opus.Models.ViewModels;
using Opus.Utility;
using Opus.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

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
            var timeekeeping = _uow.TimeKeeping.GetAll().Where(i => (i.Year == DateTime.Now.Year && i.Month == DateTime.Now.Month));
            var activeStaff = _uow.Staff.GetAll(i => (i.Status == 1 && i.Active));//activestaff ve timekeeping ile beraber countları karşılaştırılıp aylık bazında time keeping kayıtları eklenilebilir. Test edilmedi.!!!!


            //var _locations = _uow.Location.GetAll(i => (i.Active && i.IsDelete == false));
            var _currenDatetime2 = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd 00:00:00.0000000");
            var _currenToday = DateTime.Today;
            var _locationsInOut = _uow.LocationInOut.GetAll(i => (i.ProcessingDate >= DateTime.Parse(_currenDatetime2) && i.InOutType == 1) && i.IsDeleted == false);
            var _motion = _uow.Staff.GetAll(i => (i.Status == 1 && i.Active && i.BlackList == false));

            var _exist = _locationsInOut.Join(activeStaff,
                io => io.StaffId,
                s => s.Id,
                (io, s) => new { inout = io, staff = s })
                .Select(x => x.staff);

            var personmotionAnonymous = _uow.StaffStamp.GetAll(includeProperties: "Staff,Stamp").Where(i => (i.Staff.Active &&
            i.Staff.Status == 1 && i.Stamp.Lost == 0 && i.CancelingDate == DateTime.Parse("0001-01-01 00:00:00.0000000")))
                .Join(timeekeeping,
                s => s.StaffId,
                r => r.StaffId,
                (s, r) => new { staffStamp = s, timeKeeping = r })
                .Where(i => (i.staffStamp.StaffId == i.timeKeeping.StaffId && !_exist.Any(x => x.Id == i.staffStamp.StaffId)))
                .OrderBy(n => n.staffStamp.Staff.FirstName);


            IEnumerable<PersonMotionVM> _personMotion = null;
            IEnumerable<PersonMotionLocations> personMotionLocations = null;
            switch ((Enums.TimeKeeping)DateTime.Now.AddDays(-3).Day)
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


            var PM = _uow.Location.GetAll(i => (i.Active && i.IsDelete == false))
                .Join(_locationsInOut,
                loc => loc.Id,
                io => io.LocationId,
                (loc, io) => new { location = loc, inout = io })
                .GroupBy(i => i.inout.LocationId, (key, g) => new
                {
                    Key = key,
                    LocationName = g.FirstOrDefault().location,
                    GetLocation = g
                    .Select(x => x.inout)
                });


            var data = PM.Select(x => new PersonMotionLocations
            {
                Location = x.LocationName,
                Counted = x.GetLocation.Count()
            }).OrderByDescending(c => c.Counted);

            var PersonMotionMain = new PersonMotionMain
            {
                PersonMotionVMs = _personMotion,
                PersonMotionLocations = data,
                ExistStaff=_exist
            };

            return View(PersonMotionMain);
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
        [HttpGet("person-motion/api/person-info/{id}")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible)]
        public PersonInfoVM GetPersonInfo(long id)
        {
            var _staff = _uow.Staff.GetFirstOrDefault(i => i.Id == id);
            var LocationInOut = _uow.LocationInOut.GetAll(i => (i.StaffId == id && i.ProcessingDate > DateTime.Now.AddDays(-7))).OrderByDescending(i => i.Id);
            var LocationList = new List<LocationInOutVM>();

            foreach (var item in LocationInOut)
            {
                //var locationIOvm = (LocationInOutVM)item;
                var locationIOvm = new LocationInOutVM
                {
                    Location = _uow.Location.GetFirstOrDefault(i => i.Id == item.LocationId).Name,
                    Hour = item.Hour,
                    Break = item.Break,
                    InOutType = item.InOutType,
                    Id = item.Id,
                    LocationId = 0,
                    StaffId = 0,
                    UserIntId = 0,
                    DateStr = item.ProcessingDate.ToString("dd-MM-yyyy"),
                };
                //locationIOvm.Location = _uow.Location.GetFirstOrDefault(i => i.Id == item.LocationId).Name;
                LocationList.Add(locationIOvm);
            }
            var personinfo = new PersonInfoVM
            {
                FullName = _staff.FirstName + ' ' + _staff.LastName,
                LocationInOut = LocationList
            };

            return personinfo;

        }
        [HttpGet("person-motion/api/location-details/{locationid}")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible)]
        public LocationDetailsMainVM GetLocationDetais(long locationid)
        {
            var _currenDatetime2 = DateTime.Now.AddDays(-20).ToString("yyyy-MM-dd 00:00:00.0000000");
            //var locationInOut = _uow.LocationInOut.GetAll(i => (i.LocationId == locationid && i.ProcessingDate >= DateTime.Parse(_currenDatetime2) && i.InOutType == 1) && i.IsDeleted == false);
            //InoutType 1 and IsDeleted 1 olanlar tamamlanmış oluyor. Lokasyon içinde değiller!
            //InoutType 1 and IsDeleted 0 olanlar lokasyonda mesaide oluyorlar.
            var locationInOut = _uow.LocationInOut.GetAll(i => (i.LocationId == locationid && i.InOutType == 1) && i.IsDeleted == false);
            var activeStaff = _uow.Staff.GetAll(i => (i.Status == 1 && i.Active));
            var locationDetailsItemList = new List<LocationDetailsItemVM>();
            foreach (var item in locationInOut)
            {
                var _staff = activeStaff.FirstOrDefault(i => i.Id == item.StaffId);
                var locationDetailsItem = new LocationDetailsItemVM
                {
                    DateStr = item.ProcessingDate.ToString("dd-MM-yyyy"),
                    FullName = _staff.FirstName + " " + _staff.LastName,
                    Hour=item.Hour,
                    StaffId= item.StaffId,
                    InOutType= item.InOutType,
                    LocationInOutId= item.Id,
                };
                locationDetailsItemList.Add(locationDetailsItem);
            }

            var _location = _uow.Location.GetFirstOrDefault(i => i.Id == locationid);
            var locationDetails = new LocationDetailsMainVM
            {
                LocationId = locationid,
                Location = _location.Name,
                LocationDetailItems= locationDetailsItemList.OrderBy(i=>i.FullName)
            };
            //Thread.Sleep(500);
            return locationDetails;
        }

        [HttpPost("person-motion/api/endofshift/")]
        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.HR_Responsible)]
        public object EndofShift([FromBody] EndOfShiftVM EOshift)
        {   
            foreach (var item in EOshift.Ids)
            {
                var inout = _uow.LocationInOut.GetFirstOrDefault(i=>i.Id==item);
                var staff = _uow.Staff.GetFirstOrDefault(i => i.Id == inout.StaffId);
            }
            Thread.Sleep(1000);
            return EOshift;
        }
    }
}
