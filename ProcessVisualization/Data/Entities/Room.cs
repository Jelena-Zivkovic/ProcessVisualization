using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System;

namespace ProcessVisualization.Data.Entities
{
    public class Room : IEntity
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime LastUpdatedAt { get; set; }
        [MaxLength(100)]        
        public string Description { get; set; } = string.Empty;

        [MaxLength(100)]        
            public string ImageUrl { get; set; } = string.Empty;

        public static implicit operator Room(User v)
        {
            throw new NotImplementedException();
        }
    }
}
