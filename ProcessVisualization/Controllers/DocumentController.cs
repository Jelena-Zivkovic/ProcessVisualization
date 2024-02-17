﻿using Microsoft.AspNetCore.Mvc;
using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using ProcessVisualization.Api.Host.Extensions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ProcessVisualization.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly IDocumentService _document;

        public DocumentController(IDocumentService document)
        {
            _document = document;
        }

        // GET: api/<DocumentsController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<DocumentsController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            return Ok(_document.GetDocument(id));
        }

        [HttpPost("Save")]
        public ActionResult Save([FromBody] DocumentCreateDto value)
        {
            return Ok(_document.SaveDocument(value, this.User.GetUserId()));
        }

        // POST api/<DocumentsController>
        [HttpPost]
        public ActionResult Post([FromBody] int roomId)
        {
            return Ok(_document.CreateDocument(roomId));
        }

        // PUT api/<DocumentsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<DocumentsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

    }
}
