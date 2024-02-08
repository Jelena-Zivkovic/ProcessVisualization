using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Contracts.DataTransferObjects;
using ProcessVisualization.Api.Contracts.DataTransferObjects.User;
using ProcessVisualization.Api.Data.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Business.Services
{
    public class AuthenticationService: IAuthenticationService
    {

        private UserManager<IdentityUser> _userManger;
        private IConfiguration _configuration;
        public AuthenticationService(UserManager<IdentityUser> userManager, IConfiguration configuration)
        {
            _userManger = userManager;
            _configuration = configuration;
        }

        public async Task<ResponseTemplateDto<UserDto>> RegisterUserAsync(RegisterDto model)
        {
            if (model == null)
                throw new NullReferenceException("Reigster Model is null");

            var identityUser = new IdentityUser
            {
                Email = model.Email,
                UserName = model.Email,
            };

            var result = await _userManger.CreateAsync(identityUser, model.Password);

            if (result.Succeeded)
            {
                return new ResponseTemplateDto<UserDto>
                {
                    Message = "User created successfully!",
                    IsSuccess = true,
                };
            }

            return new ResponseTemplateDto<UserDto>
            {
                Message = "User did not create",
                IsSuccess = false
            };
        }

        public async Task<ResponseTemplateDto<LoginResultDto>> LoginUserAsync(LoginDto model)
        {
            var user = await _userManger.FindByEmailAsync(model.Email);

            if (user == null)
            {
                return new ResponseTemplateDto<LoginResultDto>
                {
                    Message = "There is no user with that Email address",
                    IsSuccess = false,
                };
            }

            var result = await _userManger.CheckPasswordAsync(user, model.Password);

            if (!result)
                return new ResponseTemplateDto<LoginResultDto>
                {
                    Message = "Invalid password",
                    IsSuccess = false,
                };

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, model.Email),
                new Claim("id", user.Id),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:IssuerSigninKey"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:validIssuer"],
                audience: _configuration["Jwt:validAudience"],
                claims: claims,
                expires: DateTime.Now.AddDays(30),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

            string tokenAsString = new JwtSecurityTokenHandler().WriteToken(token);

            return new ResponseTemplateDto<LoginResultDto>
            {
                Message = tokenAsString,
                IsSuccess = true,
                Data = new LoginResultDto { 
                    AccessToken = tokenAsString,
                    RefreshToken = "dfa"+ tokenAsString,
                    ExpiresIn = (int.Parse(_configuration["Jwt:expiryInMinutes"])) * 60
                }
                //ExpireDate = token.ValidTo
            };
        }

        public async Task<ResponseTemplateDto<UserDto>> ConfirmEmailAsync(string userId, string token)
        {
            var user = await _userManger.FindByIdAsync(userId);
            if (user == null)
                return new ResponseTemplateDto<UserDto>
                {
                    IsSuccess = false,
                    Message = "User not found"
                };

            var decodedToken = WebEncoders.Base64UrlDecode(token);
            string normalToken = Encoding.UTF8.GetString(decodedToken);

            var result = await _userManger.ConfirmEmailAsync(user, normalToken);

            if (result.Succeeded)
                return new ResponseTemplateDto<UserDto>
                {
                    Message = "Email confirmed successfully!",
                    IsSuccess = true,
                };

            return new ResponseTemplateDto<UserDto>
            {
                IsSuccess = false,
                Message = "Email did not confirm",
                //Errors = result.//Errors.Select(e => e.Description)
            };
        }

        public async Task<ResponseTemplateDto<UserDto>> ForgetPasswordAsync(string email)
        {
            var user = await _userManger.FindByEmailAsync(email);
            if (user == null)
                return new ResponseTemplateDto<UserDto>
                {
                    IsSuccess = false,
                    Message = "No user associated with email",
                };

            var token = await _userManger.GeneratePasswordResetTokenAsync(user);
            var encodedToken = Encoding.UTF8.GetBytes(token);
            var validToken = WebEncoders.Base64UrlEncode(encodedToken);

            string url = $"{_configuration["AppUrl"]}/ResetPassword?email={email}&token={validToken}";

            //await _mailService.SendEmailAsync(email, "Reset Password", "<h1>Follow the instructions to reset your password</h1>" +
            //    $"<p>To reset your password <a href='{url}'>Click here</a></p>");

            return new ResponseTemplateDto<UserDto>
            {
                IsSuccess = true,
                Message = "Reset password URL has been sent to the email successfully!"
            };
        }

        public async Task<ResponseTemplateDto<UserDto>> ResetPasswordAsync(ResetPasswordDto model)
        {
            var user = await _userManger.FindByEmailAsync(model.Email);
            if (user == null)
                return new ResponseTemplateDto<UserDto>
                {
                    IsSuccess = false,
                    Message = "No user associated with email",
                };

            if (model.NewPassword != model.ConfirmPassword)
                return new ResponseTemplateDto<UserDto>
                {
                    IsSuccess = false,
                    Message = "Password doesn't match its confirmation",
                };

            var decodedToken = WebEncoders.Base64UrlDecode(model.Token);
            string normalToken = Encoding.UTF8.GetString(decodedToken);

            var result = await _userManger.ResetPasswordAsync(user, normalToken, model.NewPassword);

            if (result.Succeeded)
                return new ResponseTemplateDto<UserDto>
                {
                    Message = "Password has been reset successfully!",
                    IsSuccess = true,
                };

            return new ResponseTemplateDto<UserDto>
            {
                Message = "Something went wrong",
                IsSuccess = false,
                //Errors = result.//Errors.Select(e => e.Description),
            };
        }
    }
}
