using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class RoomUser : IEntity<int>
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public virtual Room Room { get; set; }
        public string UserId { get; set; }
        public bool isAdmin { get; set; }
        public bool isActive { get; set; } = true;
        public virtual User User { get; set; }
    }
}
