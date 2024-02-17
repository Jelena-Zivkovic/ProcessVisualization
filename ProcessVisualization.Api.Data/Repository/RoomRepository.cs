using Microsoft.EntityFrameworkCore;
using ProcessVisualization.Api.Data.Models;

namespace ProcessVisualization.Api.Data.Repository
{
    public class RoomRepository : EfCoreRepository<Room, int>
    {
        public RoomRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Room> Get(int id)
        {
            var room = context.Set<Room>().Where(x => x.Id == id)
                .Include(x => x.Documents)
                .Include(x => x.RoomUsers)
                    .ThenInclude(x => x.User).FirstOrDefault();
            return room;
        }

        public async Task<Room> GetByCode(string code)
        {
            var room = context.Set<Room>().Where(x => x.RoomCode == code).FirstOrDefault();
            return room;
        }
    }
}
