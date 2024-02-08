using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class Element : IEntity<string>
    {
        public string Id { get; set; }
        public int DocumentId { get; set; }
        public virtual Document Document { get; set; }
        public string Type { get; set; }
        public string? LabelId { get; set; }
        public string? ParentId { get; set; }

    }
}
