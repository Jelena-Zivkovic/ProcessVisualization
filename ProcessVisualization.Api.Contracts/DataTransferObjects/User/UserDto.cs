using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects.User
{
    public class UserDto
    {
        public string Id { get; set; }
        public string Name { get; set; }    
        public string Email { get; set; }
        public string ImageBase64 { get; set; }
    }
}
