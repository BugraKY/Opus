using System.Net.Mail;
using System.Net;
using Opus.Utility;
using System.Text.Encodings.Web;

namespace Opus.Extensions
{
    public class SMTPExtension
    {
        static string From = "system@opus-sys.com";
        static string To = "bugra.kaya@expert-qs.com";
        static string Subject = "Opus 2FA Code";
        static string Body = @"";

        static string Username = "system@opus-sys.com"; // get from Mailtrap
        static string Password = "Lc36H8Pq"; // get from Mailtrap

        static string Host = "smtp.opus-sys.com";
        static int Port = 465;
        public static void SENDMAIL()
        {
            /*
            Body = HTMLtemplates.MAILVERF;
            var client = new SmtpClient(Host, Port)
            {
                Credentials = new NetworkCredential(Username, Password),
                EnableSsl = true,
                DeliveryFormat=SmtpDeliveryFormat.International
            };
            client.Send(From, To, Subject, Body);
            Console.WriteLine(client);
            */

            try
            {
                SmtpClient smtpClient = new SmtpClient()
                {
                    Host = Host,
                    Port = Port,
                    EnableSsl = false,
                    Timeout = 60000,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Credentials = new NetworkCredential(Username, Password)
                };
                MailMessage msg = new MailMessage();
                msg.To.Add("bugra.kaya@expert-qs.com");
                msg.From = new MailAddress(From, "Opus System");
                msg.Subject = Subject;
                msg.Body = HTMLtemplates.MAILVERF;
                msg.IsBodyHtml = true;
                smtpClient.Send(msg);
                Console.WriteLine("Smtp Gönderildi: " + "bugra.kaya@expert-qs.com");
            }
            catch (Exception e)
            {
                Console.WriteLine("\n\n Error:\n" + e.Message);
            }
        }
        /*
        public static void SENDEXCHMAIL()
        {
            try
            {
                SmtpClient smtpClient = new SmtpClient()
                {
                    Host = "smtp.office365.com",
                    Port = 587,
                    EnableSsl = true,
                    Timeout = 60000,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Credentials = new NetworkCredential("bugra.kaya@expert-qs.com", "OWdeb090")
                };
                MailMessage msg = new MailMessage();
                msg.To.Add("bugra.kaya@expert-qs.com");
                msg.From = new MailAddress("opus-system@expert-qs.com", "Opus System");
                msg.Subject = "Opus System Verify Code";
                msg.Body = HTMLtemplates.MAILVERF;
                msg.IsBodyHtml = true;
                smtpClient.Send(msg);
                Console.WriteLine("Smtp Gönderildi: " + "bugra.kaya@expert-qs.com");
            }
            catch (Exception e)
            {
                Console.WriteLine("\n\n Error:\n" + e.Message);
            }
        }
        */
    }
}
