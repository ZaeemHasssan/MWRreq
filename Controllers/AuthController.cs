using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FFnF_Request.Controllers
{
    public class AuthController : Controller
    {
        //[Route("login")]
        public IActionResult Login()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Mails", "Home");
                //return Redirect("/Home/complaints");
            }
            else
            {
                return View(); // Redirect to Login if not authenticated
            }
        }

        

        [Authorize]
        [Route("createuser")]
        public IActionResult Register()
        {
            return View();
        }

        [Authorize]
        [Route("users")]
        public IActionResult ExistingUsers()
        {
            return View();
        }
    }
}
