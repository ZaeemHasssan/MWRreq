using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FFnF_Request.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        [Route("settings")]
        public IActionResult AccountSettings()
        {
            return View();
        }

        [Route("complaints")]
        public IActionResult Mails()
        {
            return View();
        }

        [Route("request")]
        public IActionResult RequestForm()
        {
            return View();
        }
        
    }
}
