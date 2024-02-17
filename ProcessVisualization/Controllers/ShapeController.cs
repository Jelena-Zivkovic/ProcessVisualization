using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ProcessVisualization.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ShapeController : ControllerBase
    {
        // GET: api/<ShapeController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<ShapeController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ShapeController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ShapeController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ShapeController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
