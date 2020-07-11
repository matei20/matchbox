﻿using MatchboxServer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using MatchboxServer.Utilities;
using MatchboxServer.Models;

namespace MatchboxServer.Controllers
{

   [Produces("application/json")]
   
    public class AuthenticationController : Microsoft.AspNetCore.Mvc.Controller
    {
        IAuthentication Repository;
        public AuthenticationController(IAuthentication _Repository)
        {
            Repository = _Repository;
        }
        //login
        [Route("api/login")]
        [HttpPost]
        public ActionResult Login([FromBody] LoginRequest request)
        {
            dynamic result = Repository.Login(request);
            if (result == null)
                return NotFound(new { message = "not found" });

            if (result.ToString() == "Error")
                return BadRequest(new { message ="Error" });
            
            if (result == "Not Matching")
                return BadRequest(new { message = "Not matching" });

            return Ok(new { token = Jwt.GenerateToken(result) });
        }

        //register
        [Route("api/register")]
        [HttpPost]
        public ActionResult Register([FromBody]RegisterRequest request)
        {
            dynamic result = Repository.Register(request);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "Password not matching")
            {
                return BadRequest(new { message = "Password not matching"});
            }
            else if (result.ToString() == "This email is already used")
            {
                return BadRequest(new { message = "This email is already used" });
            }
            else if (result.ToString() == "Email format incorrect")
            {
                return BadRequest(new { message = "Email format incorrect" });
            }
            else if (result.ToString() == "Field cannot be empty")
            {
                return BadRequest(new { message = "Field cannot be empty" });
            }
            else if (result.ToString() == "Error")
            {
                return BadRequest(new { message = "Error" });
            }

            return Ok(new { token = Jwt.GenerateToken(result) });
        }
        
        //delete user
        [Route("api/delete-user")]
        [HttpDelete]
        public ActionResult DeleteUser()
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            if (authorizationToken == "")
                return Unauthorized();
            int id = Jwt.GetIdFromToken(authorizationToken);
            if (id == 0)
                return Unauthorized();
            dynamic result = Repository.DeleteUser(id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            return Ok(new { message = "Done" });
        }


        //server-info
        [Route("api/server-info")]
        [HttpGet]
        public ActionResult ServerInfo()
        {
            return Ok("Server running");
        }
        
    }
}