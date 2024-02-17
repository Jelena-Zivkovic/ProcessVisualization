using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects.Room
{
    public class LeaveRoomDto
    {
        public int RoomId { get; set; }
        public string UserEmail { get; set; }
    }
}
