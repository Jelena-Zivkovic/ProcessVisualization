using ProcessVisualization.Api.Business.Extensions;
using System.Security.Claims;

namespace ProcessVisualization.Api.Host.Extensions
{
    public static class StartupExtensions
    {
        public static void RegisterApiServices(
            this IServiceCollection services,
            IConfiguration configuration,
            IWebHostEnvironment environment
        )
        {
            services.RegisterBusinessServices(configuration, environment);

            //services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            //services.AddScoped<ExceptionHandlingMiddleware>();
            //services.AddScoped<ModelValidationMiddleware>();

        }
    }
}
