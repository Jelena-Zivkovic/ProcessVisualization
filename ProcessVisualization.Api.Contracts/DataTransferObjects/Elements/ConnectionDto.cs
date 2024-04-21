using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects.Elements
{
    public class ConnectionDto
    {
        public int? Id { get; set; }
        public string ElementId { get; set; }
        public string Type { get; set; } = "bpmn:SequenceFlow";
        public string Target { get; set; }
        public string Source { get; set; }
        public List<PointDto> WayPoints { get; set; } = new List<PointDto>();
    }
}
