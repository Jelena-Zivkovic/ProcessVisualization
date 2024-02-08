using ProcessVisualization.Api.Contracts.DataTransferObjects;
using ProcessVisualization.Api.Contracts.DataTransferObjects.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Business.Services.Interfaces
{
    public interface IAuthenticationService
    {
        Task<ResponseTemplateDto<UserDto>> RegisterUserAsync(RegisterDto model);
        Task<ResponseTemplateDto<LoginResultDto>> LoginUserAsync(LoginDto model);
        Task<ResponseTemplateDto<UserDto>> ConfirmEmailAsync(string userId, string token);
        Task<ResponseTemplateDto<UserDto>> ForgetPasswordAsync(string email);
        Task<ResponseTemplateDto<UserDto>> ResetPasswordAsync(ResetPasswordDto model);
    }
}
