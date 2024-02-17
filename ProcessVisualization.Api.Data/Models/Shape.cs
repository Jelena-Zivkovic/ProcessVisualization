using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class Shape : IEntity<int>
    {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public virtual Document Document { get; set; }
        public string ElementId { get; set; }
        public string Type { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal X { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public double Y { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Width { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Height { get; set; }
    }
}
