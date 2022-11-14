using System.Net.Mail;
using System.Net;
using Opus.Utility;
using System.Text.Encodings.Web;

namespace Opus.Extensions
{
    public class SMTPExtension
    {
        static string From = "opus-system@expert-qs.com";
        static string To = "bugra.kaya@expert-qs.com";
        static string Subject = "Opus Verification Code";
        static string Body = @"";

        static string Username = "bugrakaya16@gmail.com"; // get from Mailtrap
        static string Password = "EyXmRh4HCsYagPpt"; // get from Mailtrap

        static string Host = "smtp-relay.sendinblue.com";
        static int Port = 587;
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
                    Host = "smtp-relay.sendinblue.com",
                    Port = 587,
                    EnableSsl = true,
                    Timeout = 60000,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Credentials = new NetworkCredential("bugrakaya16@gmail.com", "EyXmRh4HCsYagPpt")
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
