using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class Document : IEntity<int>
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
        public virtual ICollection<Connection> Connections { get; set; }
        public virtual ICollection<Shape> Shapes { get; set; }
    }
}
