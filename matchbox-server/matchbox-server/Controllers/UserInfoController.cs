using MatchboxServer.Interfaces;
using MatchboxServer.Utilities;
using MatchboxServer.Models;
using Microsoft.AspNetCore.Mvc;
using System;


namespace MatchboxServer.Controllers
{
    [Produces("application/json")]
    public class UserInfoController:Microsoft.AspNetCore.Mvc.Controller
    {
        IUserInfo Repository;
        public UserInfoController(IUserInfo _Repository)
        {
            Repository = _Repository;
        }

        //get conversations
        [Route("api/conversations")]
        [HttpGet]
        public ActionResult Conversations()
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            if (authorizationToken == "")
                return Unauthorized();
            int id = Jwt.GetIdFromToken(authorizationToken);
            if (id == 0)
                return Unauthorized();
            dynamic result = Repository.GetUserConversations(id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            return Ok(result);
        }

        //set conversation readed messages
        [Route("api/conversationSeen")]
        [HttpPost]
        public ActionResult ConversationSeen([FromBody]Conversation request)
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            if (authorizationToken == "")
                return Unauthorized();
            int id = Jwt.GetIdFromToken(authorizationToken);
            if (id == 0)
                return Unauthorized();
            dynamic result = Repository.SetConversationToSeen(request, id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            return Ok(result);
        }

        //save user location POST
        [Route("api/save-user-location")]
        [HttpPost]
        public ActionResult SaveUserLocation([FromBody]LocationRequest request)
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            if (authorizationToken == "")
                return Unauthorized();
            int id = Jwt.GetIdFromToken(authorizationToken);
            if (id == 0)
                return Unauthorized();
            dynamic result = Repository.SetUserLocationInfo(request, id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            return Ok(new { message = "Done" });
        }

        //user information GET
        [Route("api/user-info")]
        [HttpGet]
        public ActionResult GetUserInfo()
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            if (authorizationToken == "")
                return Unauthorized();
            int id = Jwt.GetIdFromToken(authorizationToken);
            if (id == 0)
                return Unauthorized();
            dynamic result = Repository.GetInfo(id);
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

        //set user information POST
        [Route("api/user-info")]
        [HttpPost]
        public ActionResult PostUserInfo([FromBody]UserInfoRequest request)
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            if (authorizationToken == "")
                return Unauthorized();
            int id = Jwt.GetIdFromToken(authorizationToken);
            if(id == 0)
                return Unauthorized();
            dynamic result = Repository.SetUserInfo(request, id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            return Ok(new { message = "Done" });
        }

        //get next account in order to perform like or not interested
        [Route("api/get-match")]
        [HttpGet]
        public ActionResult GetMatch()
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            if (authorizationToken == "")
                return Unauthorized();
            int id =  Jwt.GetIdFromToken(authorizationToken);
            if (id == 0)
                return Unauthorized();
            dynamic result = Repository.GetMatch(id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }

            foreach (var res in result)
            {
                dynamic user1Location = Repository.GetUserLocationInfo(id);
                dynamic user2Location = Repository.GetUserLocationInfo(Convert.ToInt32(res.ID));
                
              
                double dist = GeoLocation.distanceBetweenTwoUsers(Convert.ToDouble(user1Location.LATITUDE), Convert.ToDouble(user1Location.LONGITUDE),
                                                                  Convert.ToDouble(user2Location.LATITUDE), Convert.ToDouble(user2Location.LONGITUDE));
                dynamic maxDistResp = Repository.GetUserMaxDistance(id);
                double maxDistance = Convert.ToDouble(maxDistResp.MAXDISTANCE);

                if (dist <= maxDistance * 1000) {
                    int distInKm = (int)(dist / 1000 + 0.5);
                    if(distInKm > 0)
                        res.MAXDISTANCE = Convert.ToString(distInKm);
                    else
                        res.MAXDISTANCE = Convert.ToString(1);
                    return Ok(res);
                }
            }
            return NotFound(new { message = "not found" });
        }

        //setlike POST
        [Route("api/set-like")]
        [HttpPost]
        public ActionResult PostSetLike([FromBody]LikeRequest request)
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            if (authorizationToken == "")
                return Unauthorized();
            int id = Jwt.GetIdFromToken(authorizationToken);
            if (id == 0)
                return Unauthorized();
            dynamic result = Repository.SetLike(request, id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            return Ok(new { message = "Done" });
        }

        //get matches
        [Route("api/matches")]
        [HttpGet]
        public ActionResult Matches()
        {
            var authorizationToken = this.Request.Headers["Authorization"].ToString();
            if (authorizationToken == "")
                return Unauthorized();
            int id = Jwt.GetIdFromToken(authorizationToken);
            if (id == 0)
                return Unauthorized();
            dynamic result = Repository.Matches(id);
            if (result == null)
                return NotFound(new { message = "not found" });
            if (result.ToString() == "ERROR")
            {
                return BadRequest(new { message = "Error" });
            }
            foreach (var res in result)
            {
                dynamic user1Location = Repository.GetUserLocationInfo(id);
                dynamic user2Location = Repository.GetUserLocationInfo(Convert.ToInt32(res.ID));
                double dist = GeoLocation.distanceBetweenTwoUsers(Convert.ToDouble(user1Location.LATITUDE), Convert.ToDouble(user1Location.LONGITUDE),
                                                                  Convert.ToDouble(user2Location.LATITUDE), Convert.ToDouble(user2Location.LONGITUDE));
                
                int distInKm = (int)(dist / 1000 + 0.5);
                if (distInKm > 0)
                    res.MAXDISTANCE = Convert.ToString(distInKm);
                else
                    res.MAXDISTANCE = Convert.ToString(1);
                
            }

            return Ok(result);
        }

    }
}
