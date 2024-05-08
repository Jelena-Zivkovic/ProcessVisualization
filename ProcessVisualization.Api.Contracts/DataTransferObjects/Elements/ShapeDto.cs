using ProcessVisualization.Api.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects.Shape
{
    public class ShapeDto
    {
        public int? Id { get; set; }
        public string ElementId { get; set; }
        public string Type { get; set; }
        public decimal X { get; set; }
        public double Y { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public string Label { get; set; } = "";
        public string FunctionName { get; set; } = "";
        public virtual List<InputParameterDto> InputParameters { get; set; }
        public virtual List<OutputParameterDto> OutputParameters { get; set; }
        //"labelIds": [],
    }
}
