using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class Connection : IEntity<int>
    {
        public int Id { get; set; }
        public string ConnectionId { get; set; }
        public int DocumentId { get; set; }
        public virtual Document Document { get; set; }
        public string Type { get; set; } = "bpmn:SequenceFlow";
        public string Target { get; set; }
        public string Source { get; set; }
        //public List<Point> WayPoints { get; set; }

    }
}
