using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcessVisualization.Api.Business.Services;
using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Room;
using ProcessVisualization.Api.Host.Extensions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ProcessVisualization.Controllers
{
    [Route("[controller]")]
   // [Authorize]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _room;

        public RoomController(IRoomService room)
        {
            _room = room;
        }

        // GET: /<RoomController>
        [HttpGet]
        public ActionResult Get()
        {
            return Ok(_room.GetAll(this.User.GetUserId()));
        }

        // GET /<RoomController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            return Ok(_room.GetByIdAsync(id));
        }

        // POST api/<RoomController>
        [HttpPost]
        public ActionResult Post([FromBody] RoomCreateDto room)
        {
            return Ok(_room.CreateRoom(room.Name, this.User.GetUserId()));
        }

        // POST api/<RoomController>
        [HttpPost("JoinRoom")]
        public ActionResult JoinRoom([FromBody] RoomJoinDto data)
        {
            return Ok(_room.JoinRoom(data.RoomCode, data.UserEmail));
        }

        [HttpPost("LeaveRoom")]
        public ActionResult LeaveRoom([FromBody] LeaveRoomDto data)
        {
            return Ok(_room.LeaveRoom(data.RoomId, data.UserEmail));
        }

        // PUT /<RoomController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE /<RoomController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
