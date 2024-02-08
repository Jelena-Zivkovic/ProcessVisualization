using Microsoft.EntityFrameworkCore;
using ProcessVisualization.Api.Data.Models;

namespace ProcessVisualization.Api.Data.Repository
{
    public class UserRepository : EfCoreRepository<User, string>
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<User>> GetUsersByRoomIdAsync(int roomId)
        {
            var allUsers = await context.Set<User>().ToListAsync();
            return allUsers.Where(x => x.RoomUsers.Any(x => x.RoomId == roomId)).ToList();
        }
    }
}
