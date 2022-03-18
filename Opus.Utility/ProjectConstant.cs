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
    }
}
