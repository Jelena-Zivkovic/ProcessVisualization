using Microsoft.EntityFrameworkCore;
using ProcessVisualization.Api.Data.Models;

namespace ProcessVisualization.Api.Data.Repository
{
    public class RoomUserRepository : EfCoreRepository<RoomUser, int>
    {
        public RoomUserRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
