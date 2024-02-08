using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32;
using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Contracts.DataTransferObjects.User;

namespace ProcessVisualization.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IAuthenticationService _authentication;
        public UsersController(IAuthenticationService authentication)
        {
            _authentication = authentication;
        }

        [HttpPost]
        public ActionResult SignUp([FromBody] RegisterDto user)
        {
            return Ok(_authentication.RegisterUserAsync(user).Result);
        }

        [HttpPost("SignIn")]
        public ActionResult SignIn([FromBody] LoginDto user)
        {
            return Ok(_authentication.LoginUserAsync(user).Result);
        }
    }
}
