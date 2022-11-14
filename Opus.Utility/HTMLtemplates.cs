using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Opus.Utility
{
    public static class HTMLtemplates
    {
        public const string MAILVERF = @"
<!DOCTYPE html>
<html>

<head>
    <meta charset='UTF-8'>
</head>

<body>
    <div style='align-items: center; padding-top:20px; border-radius: 25px; display: table; margin: 0 auto; -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75); -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75); box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);'>
        <div style='margin: 15px;'>
            <img src='http://opus.expert-qs.com/images/opus_logo.png' alt=''>
            <div class='row'>
                <h4>Hi Buğra Kaya</h4>
                <br/>
                <p style='font-size: 18px;'>We using Two-Factor Authentication and caring about security. You should use this code for sign in within 60 seconds.</p>
                <p style='font-size: 18px;'>Verification Code: <span style='font-weight: bold; '>123456</span></p>
            </div>
        </div>
    </div>

</body>

</html>
";
    }
}
