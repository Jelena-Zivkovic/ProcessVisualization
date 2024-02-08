using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using ProcessVisualization.Api.Contracts.DataTransferObjects.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects.Room
{
    public class RoomDetailsViewDto : RoomViewDto
    {
        public List<UserDto> Users { get; set; } 
        public List<DocumentDto> Documents { get; set; }
    }
}
