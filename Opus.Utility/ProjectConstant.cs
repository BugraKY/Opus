using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Utility
{
    public class ProjectConstant
    {
        public static class UserRoles
        {
            public const string Admin = "Admin";
            public const string Accounting = "Accounting";
            public const string QS_Operation = "QS_Operation";//Kalite ve Operasyon Görevlisi
            public const string FieldOfficer = "FieldOfficer";//Saha yetkilisi
            public const string ProjectResponsible = "ProjectResponsible";
            public const string OperationResponsible = "OperationResponsible";
        }
        public static class UserRolesEn
        {
            public const string Admin = "Admin";
            public const string Accounting = "Accounting";
            public const string QS_Operation = "Quality & Operation";//Kalite ve Operasyon Görevlisi
            public const string FieldOfficer = "Field Officer";//Saha yetkilisi
            public const string ProjectResponsible = "Project Responsible";
            public const string OperationResponsible = "Operation Responsible";
        }
        public static class UserRolesTr
        {
            public const string Admin = "Yönetici";
            public const string Accounting = "Muhasebe";
            public const string QS_Operation = "Kalite ve Operasyon";//Kalite ve Operasyon Görevlisi
            public const string FieldOfficer = "Saha Yetkilisi";//Saha yetkilisi
            public const string ProjectResponsible = "Proje Yetkilisi";
            public const string OperationResponsible = "Operasyon Yetkilisi";
        }
        public static class AppConfig
        {
            //public static List<string> Localhost = "";
            public static IEnumerable<string>? Localhost;
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
                public const string TaskDefinition = @"\assets\testfiles\TaskDefinition";
            }
        }

    }
}
