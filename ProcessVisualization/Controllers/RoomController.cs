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
            return Ok(_room.CreateRoomAsync(room.Name, this.User.GetUserId()));
        }

        // POST api/<RoomController>
        [HttpPost("JoinRoom/{roomId}/{userId}")]
        public ActionResult JoinRoom(int roomId, string userId)
        {
            return Ok(_room.JoinRoom(roomId, userId));
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
