using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;
using sib_api_v3_sdk.Model;
using System.Diagnostics;
using Twilio;
using Twilio.Types;
using Twilio.Rest.Api.V2010.Account;
using System.Text;
using System.Net.Http.Headers;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using RestSharp;
using Twilio.TwiML.Voice;

namespace Opus.Extensions
{
    public static class SendSMSExtension
    {
        static string apikey = "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";
        //static string apikey= "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";
        static string apivalue = "api";
        
        public static void SEND()
        {
            Configuration.Default.ApiKey.Add("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", "api");

            var apiInstance = new TransactionalSMSApi();
            string sender = "OPUS SYSTEM";
            string recipient = "+905437786715";
            string content = "This is a transactional SMS for OPUS USERS";
            SendTransacSms.TypeEnum type = SendTransacSms.TypeEnum.Transactional;
            string tag = "2FA";
            string webUrl = "https://localhost:5001/";
            try
            {
                var sendTransacSms = new SendTransacSms(sender, recipient, content, type, tag, webUrl);
                //var sendTransacSms = new SendTransacSms(sender, recipient, content, type);
                SendSms result = apiInstance.SendTransacSms(sendTransacSms);
                //Debug.WriteLine(result.ToJson());
                Console.WriteLine(result.ToJson());
                Console.ReadLine();
            }
            catch (Exception e)
            {
                //Debug.WriteLine(e.Message);
                Console.WriteLine(e.Message);
                Console.ReadLine();
            }
        }
        
        
        public static void SENDwithTwilio()
        {
            // Find your Account SID and Auth Token at twilio.com/console
            // and set the environment variables. See http://twil.io/secure
            try
            {
                string accountSid = "AC5a3fac8e22f9bf7a89567103104232e7";
                string authToken = "4b20cc76995218511637e71f114cfe12";

                TwilioClient.Init(accountSid, authToken);

                var message = MessageResource.Create(
                    body: "This is a test message from Opus..",
                    from: new PhoneNumber("+905437786715"),
                    to: new PhoneNumber("+905437786715")
                );

                Console.WriteLine(message.Sid);
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n");
                Console.WriteLine("SEND SMS ERROR:");
                if (ex.InnerException != null)
                    Console.WriteLine(ex.InnerException.Message);
                else
                    Console.WriteLine(ex.Message);
            }
        }
        

        public async static void TestTwilio()
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var request = new HttpRequestMessage(new HttpMethod("POST"), "https://verify.twilio.com/v2/Services/YOUR_VERIFY_SID/Verifications"))
                    {
                        var base64authorization = Convert.ToBase64String(Encoding.ASCII.GetBytes("AC5a3fac8e22f9bf7a89567103104232e7:$TWILIO_AUTH_TOKEN"));
                        request.Headers.TryAddWithoutValidation("Authorization", $"Basic {base64authorization}");

                        var contentList = new List<string>();
                        contentList.Add($"To={Uri.EscapeDataString("+905437786715")}");
                        contentList.Add($"Channel={Uri.EscapeDataString("sms")}");
                        contentList.Add($"To={Uri.EscapeDataString("+905437786715")}");
                        contentList.Add($"Code={Uri.EscapeDataString("$OTP_CODE")}");
                        request.Content = new StringContent(string.Join("&", contentList));
                        request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-www-form-urlencoded");

                        var response = await httpClient.SendAsync(request);

                        Console.WriteLine(response.StatusCode.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                if (ex.InnerException == null)
                    Console.WriteLine("ERROR: " + ex.Message);
                else
                    Console.WriteLine("ERROR: " + ex.InnerException.Message);
            }
        }
        /*
        public static Task TestASPSMSAsync()
        {
            ASPSMS.SMS SMSSender = new ASPSMS.SMS();

            SMSSender.Userkey = "N2F9NRU9A4QC";
            SMSSender.Password = "m1xbw4SL8c6VTOAHKWNBrdse";
            //SMSSender.Originator = Options.SMSAccountFrom;

            SMSSender.AddRecipient("+905437786715");
            SMSSender.MessageData = "This is a Test Message from OPUS SYSTEM";

            SMSSender.SendTextSMS();

            return Task.FromResult(0);
        }
        */
        public static void TestTopluSMS()
        {
            //c412fbcdec32946ed27bb9f1 API KULLANICI ADI
            //8c65a33a766d64c4274178a0 API ŞİFRE


            var client = new RestClient("https://api.toplusmspaketleri.com/api/v1/1toN");

            //client.Timeout = -1;

            var request = new RestRequest();
            request.Method = Method.Post;

            request.AddHeader("Content-Type", "application/json");

            var body = @"{""api_id"": ""c412fbcdec32946ed27bb9f1"",""api_key"": ""8c65a33a766d64c4274178a0"",""sender"": ""SMSBASLIGINIZ"",""message_type"": ""turkce"",""message"":""Bu bir test mesajıdır."",""phones"": [""5437786715"",""5437786715""]}";

            request.AddParameter("application/json", body, ParameterType.RequestBody);

            RestResponse response = client.Execute(request);

            Console.WriteLine(response.Content);
        }
    }
}
