using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ProcessVisualization.Api.Data.Config;
using ProcessVisualization.Api.Data.Models;

namespace ProcessVisualization.Api.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        private IConfiguration Configuration;
        public DbSet<RoomUser> RoomUsers { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<Element> Elements { get; set; }
        public DbSet<Shape> Shapes { get; set; }
        public DbSet<Point> Points { get; set; }

        public ApplicationDbContext() { }
        
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration) : base(options)
        {
            this.Configuration = configuration;
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            foreach (var relationship in builder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new ShapeConfig());
            builder.ApplyConfiguration(new ConnectionConfig());
            // builder.ApplyConfiguration(new DocumentConfig());
        }
        }
}
