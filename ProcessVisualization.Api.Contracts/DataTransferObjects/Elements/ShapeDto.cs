using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects.Shape
{
    public class ShapeDto
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public decimal X { get; set; }
        public double Y { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
          //"labelIds": [],
    }
}
