using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class Room : IEntity<int>
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;


        public string RoomCode { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime LastUpdatedAt { get; set; }
        [MaxLength(100)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(100)]
        public string ImageUrl { get; set; } = string.Empty;
        public virtual ICollection<RoomUser> RoomUsers { get; set; }
        public virtual ICollection<Document> Documents { get; set;}
    }
}
