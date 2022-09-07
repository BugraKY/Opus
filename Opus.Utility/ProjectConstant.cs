using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Utility
{
    public class ProjectConstant
    {
        public static class Const
        {
            public const string OR = ",";
        }
        public static class UserRoles
        {
            public const string Admin = "Admin";
            public const string HR_Responsible = "HR_Responsible";
            public const string Accounting = "Accounting";
            public const string QS_Operation = "QS_Operation";//Kalite ve Operasyon Görevlisi
            public const string FieldOfficer = "FieldOfficer";//Saha yetkilisi
            public const string ProjectResponsible = "ProjectResponsible";
            public const string OperationResponsible = "OperationResponsible";

            public const string OperationScannerApp = "OperatorScanResponsible";
        }
        public static class UserRolesEn
        {
            public const string Admin = "Admin";
            public const string HR_Responsible = "HR_Responsible";
            public const string Accounting = "Accounting";
            public const string QS_Operation = "Quality & Operation";//Kalite ve Operasyon Görevlisi
            public const string FieldOfficer = "Field Officer";//Saha yetkilisi
            public const string ProjectResponsible = "Project Responsible";
            public const string OperationResponsible = "Operation Responsible";

            public const string OperationScannerApp = "Operator Scan Responsible";
        }
        public static class UserRolesTr
        {
            public const string Admin = "Yönetici";
            public const string HR_Responsible = "İnsan Kaynakları";
            public const string Accounting = "Muhasebe";
            public const string QS_Operation = "Kalite ve Operasyon";//Kalite ve Operasyon Görevlisi
            public const string FieldOfficer = "Saha Yetkilisi";//Saha yetkilisi
            public const string ProjectResponsible = "Proje Yetkilisi";
            public const string OperationResponsible = "Operasyon Yetkilisi";

            public const string OperationScannerApp = "Operator Tarama Sorumlusu";
        }
        public static class AppConfig
        {
            //public static List<string> Localhost = "";
            public static IEnumerable<string>? Localhost;
        }

        public static class Notification
        {
            public static class TYPEUSER    
            {
                public const string DANGER_I_TAG = @"<i class=""fa fa-users text-danger"">";
                public const string WARNING_I_TAG = @"<i class=""fa fa-users text-warning"">";
                public const string INFO_I_TAG = @"<i class=""fa fa-users text-info"">";
                public const string SUCCESS_I_TAG = @"<i class=""fa fa-users text-success"">";
            }
            public static class END_TAGS
            {
                public const string TAG_I = "</i>";
                public const string TAG_A = "</a>";
                public const string TAG_DIV = "</div>";
            }
        }
        public static class RefVerf
        {
            public static class Header
            {
                public const string SUCCESS = "Trained Reference.";
                public const string WARNING = "Invalid Reference.";
                public const string DANGER = "Uneducated Reference!";
            }
            public static class Message
            {
                public const string SUCCESS = "Trained Reference by ";
                public const string WARNING = "Invalid Reference by ";
                public const string DANGER = "Scanned or Entered Uneducated Reference by ";
            }
        }
        public class Toast
        {
            public static class ShowHideTransition
            {
                public const string Fade = "fade";
                public const string Slide = "slide";
                public const string Plain = "plain";
            }
            public static class Icon
            {
                public const string Info = "info";
                public const string Warning = "warning";
                public const string Error = "error";
                public const string Success = "success";
            }
            public static class HideAfter
            {
                public const int Short = 2000;
                public const int Normal = 5000;
                public const int Long = 7000;
            }
        }

        public class Path
        {
            public static class CreateFiles
            {
                /*
                public const string Identity= @"\assets\testfiles\Identity";
                public const string HealthReport = @"\assets\testfiles\HealthReport";
                public const string MilitaryStatus = @"\assets\testfiles\MilitaryStatus";
                public const string Diploma = @"\assets\testfiles\Diploma";
                public const string KVKKLaborAgreement = @"\assets\testfiles\KVKKLaborAgreement";
                public const string OHSInstructionCommitmentForm = @"\assets\testfiles\OHSInstructionCommitmentForm";
                public const string BloodType = @"\assets\testfiles\BloodType";
                public const string DrivingLicence = @"\assets\testfiles\DrivingLicence";
                public const string PlaceResidence = @"\assets\testfiles\PlaceResidence";
                public const string TetanusVaccine = @"\assets\testfiles\TetanusVaccine";
                public const string KVKKCommitmentReport = @"\assets\testfiles\KVKKCommitmentReport";
                public const string InternalRegulation = @"\assets\testfiles\InternalRegulation";
                public const string Insurance = @"\assets\testfiles\Insurance";
                public const string BusinessArrangement = @"\assets\testfiles\BusinessArrangement";
                public const string Overtime = @"\assets\testfiles\Overtime";
                public const string CommitmentForm = @"\assets\testfiles\CommitmentForm";
                public const string MSATest = @"\assets\testfiles\MSATest";
                public const string CriminalReport = @"\assets\testfiles\CriminalReport";
                public const string AgiForm = @"\assets\testfiles\AgiForm";
                public const string WorkSafety = @"\assets\testfiles\WorkSafety";
                public const string D2Test = @"\assets\testfiles\D2Test";
                public const string TaskDefinition = @"\assets\testfiles\TaskDefinition";*/
            }
            public static class Personels
            {

                public const string Root = @"\assets\personels\";
                public const string Documentation = @"\doc\";
                public const string ProfileIMG = @"\img\";
            }
            public static class AccountingPath
            {
                public static class Company
                {
                    public const string Root = @"\assets\accounting\company\";
                    public const string ProfileIMG = @"\img\";
                }
            }
            public static class Training
            {
                public const string TrainingDIR = @"\assets\training\";
            }
        }

        public class BankAuth
        {
            public static class IBAN
            {
                public static int Control { get; set; }
                public static int BankCode { get; set; }
                public static int NationalControl { get; set; }
                public static int AccountNumber { get; set; }
            }
        }

        public static string[] GetAllLocalIPv4()
        {
            List<string> ipAddrList = new List<string>();
            foreach (NetworkInterface item in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (item.NetworkInterfaceType == NetworkInterfaceType.Ethernet && item.OperationalStatus == OperationalStatus.Up)
                {
                    foreach (UnicastIPAddressInformation ip in item.GetIPProperties().UnicastAddresses)
                    {
                        if (ip.Address.AddressFamily == AddressFamily.InterNetwork)
                        {
                            ipAddrList.Add(ip.Address.ToString());
                        }
                    }
                }
                else if (item.NetworkInterfaceType == NetworkInterfaceType.Wireless80211 && item.OperationalStatus == OperationalStatus.Up)
                {
                    foreach (UnicastIPAddressInformation ip in item.GetIPProperties().UnicastAddresses)
                    {
                        if (ip.Address.AddressFamily == AddressFamily.InterNetwork)
                        {
                            ipAddrList.Add(ip.Address.ToString());
                        }
                    }
                }
            }
            return ipAddrList.ToArray();
        }

    }
}
