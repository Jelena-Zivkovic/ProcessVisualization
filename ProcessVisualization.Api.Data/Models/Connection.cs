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
        public int DocumentId { get; set; }
        public virtual Document Document { get; set; }
        
    }
}
