using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class InputParameter : IEntity<int>
    {
        public int Id { get; set; }
        public int ShapeId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }

    }
}
