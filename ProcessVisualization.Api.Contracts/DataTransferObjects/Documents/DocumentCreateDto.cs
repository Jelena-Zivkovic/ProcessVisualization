using ProcessVisualization.Api.Contracts.DataTransferObjects.Elements;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Shape;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects.Documents
{
    public class DocumentCreateDto
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public int RoomId { get; set; }
        public List<ShapeDto> Shapes { get; set; }
        public List<ConnectionDto> Connections { get; set; }
    }
}
