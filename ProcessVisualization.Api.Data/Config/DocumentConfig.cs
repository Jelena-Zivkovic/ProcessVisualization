using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProcessVisualization.Api.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Config
{
    public class DocumentConfig : IEntityTypeConfiguration<Document>
    {
        public void Configure(EntityTypeBuilder<Document> builder)
        {
            builder.HasOne(x => x.LastUpdatedBy)
                    .WithMany()
                    .HasForeignKey(x => x.LastUpdatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull);


            builder.HasOne(x => x.Room)
                .WithMany(x => x.Documents)
                .HasForeignKey(x => x.RoomId);
        }
    }
}
