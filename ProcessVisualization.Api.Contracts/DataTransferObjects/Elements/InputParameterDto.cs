using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class InputParameterDto 
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public string? Value { get; set; }
        public int SerialNumber { get; set; }

    }
}
