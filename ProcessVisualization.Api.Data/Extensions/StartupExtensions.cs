using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProcessVisualization.Api.Data.Models;
using ProcessVisualization.Api.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Extensions
{
    public static class StartupExtensions
    {
        public static void RegisterDataServices(
            this IServiceCollection services,
            IConfiguration configuration,
            IWebHostEnvironment environment
        )
        {
            //var connectionString = configuration.GetConnectionString(nameof(DiligentFinancialsDbContext));
            //services.AddDbContext<DiligentFinancialsDbContext>(
            //    options =>
            //    {
            //        options.UseSqlServer(connectionString);
            //        options.EnableSensitiveDataLogging(environment == null || environment.IsDevelopment());
            //    },
            //    ServiceLifetime.Scoped
            //);

            ////services.AddDbContextPool<DiligentFinancialsDbContext>(
            ////    (serviceProvider, options) =>
            ////    {
            ////        options.UseSqlServer(connectionString);
            ////        options.EnableSensitiveDataLogging(environment == null || environment.IsDevelopment());
            ////    }
            ////);
            ////services.AddSingleton<SemaphoreSlim>();

            //// IdentityDBContext 
            //services.AddScoped<DGFEmailConfirmationTokenProvider>();
            //services.AddScoped<DGFIdentityErrorDescriptor>();
            //services.AddScoped<DGFPasswordResetTokenProvider>();
            //services.AddScoped<DiligentFinancialsDbContext>();
            ////Repositories
            //services.AddScoped< IRepository<Room>, RoomRepository >();
            //services.AddScoped<IRepository<User>, UserRepository>();
            //services.AddScoped<IRepository<RoomUser>, RoomUserRepository>();
            //services.AddScoped<IRepository<Document>, DocumentRepository>();
            //services.AddScoped<IRepository<Shape>, ShapeRepository>();
            //services.AddScoped<IRepository<Connection>, ConnectionRepository>();

            services.AddScoped<RoomRepository>();
            services.AddScoped<UserRepository>();
            services.AddScoped<RoomUserRepository>();
            services.AddScoped<DocumentRepository>();
            services.AddScoped<ShapeRepository>();
            services.AddScoped<ConnectionRepository>();


            //services.AddScoped<IAccountTypeRepository, AccountTypeRepository>();
            //services.AddScoped<IApplicationSettingRepository, ApplicationSettingRepository>();
            //services.AddScoped<IDomainRepository, DomainRepository>();
            //services.AddScoped<IEventRepository, EventRepository>();
            //services.AddScoped<IEventTypeRepository, EventTypeRepository>();
            //services.AddScoped<IEventTagRepository, EventTagRepository>();
            //services.AddScoped<ITagTypeRepository, TagTypeRepository>();
            //services.AddScoped<IRolesRepository, RolesRepository>();
            //services.AddScoped<ITransactionRepository, TransactionRepository>();
            //services.AddScoped<IUsersDataRepository, UsersDataRepository>();
            //services.AddScoped<IReportRepository, ReportRepository>();
            //services.AddScoped<IPermissionRepository, PermissionRepository>();
            //services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            //services.AddScoped<IEventStateTypesRepository, EventStateTypesRepository>();
            //services.AddScoped<IAuditLogRepository, AuditLogRepository>();
            //services.AddScoped<IActionAuditLogRepository, ActionAuditLogRepository>();
            //services.AddScoped<IPermissionRepository, PermissionRepository>();
            //services.AddScoped<IAccountStateTypeRepository, AccountStateTypeRepository>();
            //services.AddScoped<IRelatedPermissionRepository, RelatedPermissionRepository>();
            //services.AddScoped<ICurrenciesRepository, CurrenciesRepository>();
            //services.AddScoped<ICurrencyRateRepository, CurrencyRateRepository>();
            //services.AddScoped<ICompanyRepository, CompanyRepository>();
        }


    }
}
