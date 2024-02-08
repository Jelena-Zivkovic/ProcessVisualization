using System.Text.Json.Serialization;

namespace ProcessVisualization.Data.Entities
{
    public class RoomUser : IEntity
    {
        public int Id { get; set; }

        public int RoomID { get; set; }

        [JsonIgnore]
        public Room Room { get; set; } = new Room();

        public int UserID { get; set; }
        [JsonIgnore]
        public User User { get; set; } = new User();
    }
}
