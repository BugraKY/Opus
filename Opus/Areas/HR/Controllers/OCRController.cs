using IronOcr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Opus.Areas.HR.Controllers
{
    [Area("HR")]
    public class OCRController : Controller
    {
        [HttpGet("test-ocr")]
        public static string TestOCR()
        {
            var Ocr = new IronTesseract();
            using (var Input = new OcrInput("image.png"))
            {
                // Input.Deskew();  // use if image not straight
                // Input.DeNoise(); // use if image contains digital noise
                var Result = Ocr.Read(Input);
                return Result.Text;
            }
        }
    }
}
