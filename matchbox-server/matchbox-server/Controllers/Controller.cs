using Core2API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;


namespace CoreAPI.Controllers
{

   [Produces("application/json")]
   
    public class Controller : Microsoft.AspNetCore.Mvc.Controller
    {
        IRepository Repository;
        public Controller(IRepository _Repository)
        {
            Repository = _Repository;
        }
        

        /// <summary>
        /// all under is good and working
        /// </summary>
        /// <returns></returns>
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
            else if (result.ToString() == "Error")
            {
                return BadRequest(new { message = "Error" });
            }

            return Ok(new { token = Jwt.GenerateToken(result) });
        }
        //user information GET
        [Route("api/user-info")]
        [HttpGet]
        public ActionResult GetUserInfo()
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            int id=Jwt.GetIdFromToken(authorizationToken);
            dynamic result = Repository.GetInfo(id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            foreach ( var res in result) {
                return Ok(res);
            }
            return Ok(result);
        }
        //set user information POST
        [Route("api/user-info")]
        [HttpPost]
        public ActionResult PostUserInfo([FromBody]UserInfoRequest request)
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            int id = Jwt.GetIdFromToken(authorizationToken);
            dynamic result = Repository.SetUserInfo(request,id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }

            //foreach (var res in result)
            //{
            //    return Ok(res);
            //}
            return Ok(new { message = "Done" });
        }
        //get match
        [Route("api/get-match")]
        [HttpGet]
        
        public ActionResult GetMatch()
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            int id = Jwt.GetIdFromToken(authorizationToken);
            dynamic result = Repository.GetMatch(id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }

            foreach (var res in result)
            {
                return Ok(res);
            }
            return Ok(result);
        }
        //setlike POST
        [Route("api/set-like")]
        [HttpPost]
        public ActionResult PostSetLike([FromBody]LikeRequest request)
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            int id = Jwt.GetIdFromToken(authorizationToken);
            dynamic result = Repository.SetLike(request, id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            //foreach (var res in result)
            //{
            //    return Ok(res);
            //}
            return Ok(new { message = "Done" });
        }
        //delete user Get
        [Route("api/delete-user")]
        [HttpGet]
        public ActionResult DeleteUser()
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            int id = Jwt.GetIdFromToken(authorizationToken);
            dynamic result = Repository.DeleteUser(id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            //foreach (var res in result)
            //{
            //    return Ok(res);
            //}
            return Ok(new { message = "Done" });
        }
        //get matches
        [Route("api/matches")]
        [HttpGet]
        public ActionResult Matches()
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            int id = Jwt.GetIdFromToken(authorizationToken);
            dynamic result = Repository.Matches(id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            //foreach (var res in result)
            //{
            //    return Ok(res);
            //}
            return Ok(result);
        }


        //altceva
        [Route("api/GetEmployeeList")]
        [HttpGet]
        public ActionResult GetEmployeeList()
        {
           //var x = this.Request.Headers["Authorization"].ToString();
            //int a=Jwt.Get_Id(x);
            var result = Repository.GetEmployeeList();
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [Route("api/GetEmployeeDetails/{empId}")]
        public ActionResult GetEmployeeDetails(int empId)
        {
            var result = Repository.GetEmployeeDetails(empId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
    }
}