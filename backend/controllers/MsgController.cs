using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetMessages()
        {
            var messages = new List<string>
            {
                "Hello from the backend!",
                "This is message 2.",
                "This is message 3."
            };

            return Ok(messages);
        }
    }
}
