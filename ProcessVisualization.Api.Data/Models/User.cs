using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Data.Models
{
    public class User : IdentityUser, IEntity<string>
    {

        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public virtual ICollection<RoomUser> RoomUsers { get; set; }

    }
}
