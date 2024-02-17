using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProcessVisualization.Api.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Config
{
    public class ShapeConfig : IEntityTypeConfiguration<Shape>
    {
        public void Configure(EntityTypeBuilder<Shape> builder)
        {
            builder.HasIndex(x => new { x.ElementId, x.DocumentId }).IsUnique();
        }
    }
}
