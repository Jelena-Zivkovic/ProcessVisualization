using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class Shape : IEntity<int>
    {
        public int Id { get; set; }
        public string ElementId { get; set; }
    }
}
