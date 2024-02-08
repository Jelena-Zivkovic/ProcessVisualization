using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ProcessVisualization.Data.Entities
{
    public class User : IdentityUser
    {
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public virtual ICollection<RoomUser> RoomUsers { get; set; }

    }
}
