using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Contracts.DataTransferObjects.Room
{
    public class RoomJoinDto
    {
        public string RoomCode { get; set; }
        public string UserEmail { get; set;}
    }
}
