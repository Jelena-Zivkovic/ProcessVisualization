using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class Point : IEntity<int>
    {
        public int Id { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal X { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Y { get; set; }
        public int ConnectionId { get; set; }

    }
}
