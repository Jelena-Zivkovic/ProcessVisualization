using ProcessVisualization.Api.Contracts.DataTransferObjects;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Room;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessVisualization.Api.Business.Services.Interfaces
{
    public interface IRoomService
    {
        public List<RoomViewDto> GetAll(string userId);
        public RoomDetailsViewDto GetByIdAsync(int id);
        public Task<ResponseTemplateDto<RoomViewDto>> CreateRoomAsync(string roomName, string userId);
        public ResponseTemplateDto<RoomViewDto> JoinRoom(int roomId, string userId);
        public ResponseTemplateDto<int> LeaveRoom(int roomId, string userId);
    }
}
