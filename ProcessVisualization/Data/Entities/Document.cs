using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProcessVisualization.Data.Entities
{
    public class Document : IEntity
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Connection> Connections { get; set; } = new List<Connection>();
        public List<Shape> Shapes { get; set; } = new List<Shape>();
    }
}
