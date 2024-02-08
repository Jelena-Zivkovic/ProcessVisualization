using ProcessVisualization.Api.Data.Models;

namespace ProcessVisualization.Api.Data.Repository
{
    public class ConnectionRepository : EfCoreRepository<Connection, int>
    {
        public ConnectionRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
