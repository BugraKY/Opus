using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IronOcr;
using Microsoft.AspNetCore.Authorization;

namespace Opus.Areas.Main.Api
{
    [Area("Main")]
    //[Route("api/[controller]")]
    //[ApiController]
    [AllowAnonymous]
    public class OCRController : Controller
    {/*
        public bool TestOCR()
        {

            return true;
        }*/
        [Route("test-ocr")]
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
            /*
            var ocrtext = string.Empty;
            using (var engine = new TesseractEngine(@"./tessdata", "eng", EngineMode.Default))
            {
                using (var img = PixConverter.ToPix(imgsource))
                {
                    using (var page = engine.Process(img))
                    {
                        ocrtext = page.GetText();
                    }
                }
            }

            return ocrtext;*/
        }
    }
}
