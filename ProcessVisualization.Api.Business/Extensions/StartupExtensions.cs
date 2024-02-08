using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProcessVisualization.Api.Business.Services.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Specialized;
using System.Threading.Tasks;
using ProcessVisualization.Api.Data.Extensions;
using ProcessVisualization.Api.Business.Services;

namespace ProcessVisualization.Api.Business.Extensions
{
    public static class StartupExtensions
    {
        public static void RegisterBusinessServices(
            this IServiceCollection services,
            IConfiguration configuration,
            IWebHostEnvironment environment
        )
        {
            services.RegisterDataServices(configuration, environment);

            // Jobs

            // Settings
            #region Settings

            #endregion

            #region Services
            services.AddScoped<IRoomService, RoomService>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            //services.AddScoped<IDocument>();
            #endregion

            #region Quartz jobs

            #endregion
        }

        public static IApplicationBuilder ConfigureBusinessServices(
            this IApplicationBuilder app,
            IWebHostEnvironment env
        )
        {
            return app;
        }
    }
}
