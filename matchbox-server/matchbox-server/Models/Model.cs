
namespace MatchboxServer.Models
{
    public class TokenRequest
    {
        public string token { get; set; }
    }
    public class Conversation
    {
        public string otherUserID { get; set; }
    }
    public class RegisterRequest
    {
        public string email { get; set; }
        public string password { get; set; }
        public string rePassword { get; set; }
    }
    public class LocationRequest
    {
        public string country { get; set; }
        public string city { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
    }
    public class LoginRequest
    {
        public string email { get; set; }
        public string password { get; set; }
    }
    public class UserInfoRequest
    {
        public string name { get; set; }
        public int age { get; set; }
        public int minAge { get; set; }
        public int maxAge { get; set; }
        public int maxDistance { get; set; }
        public string gender { get; set; }
        public string school { get; set; }
        public string job { get; set; }
        public string company { get; set; }
        public string description { get; set; }
    }
    public class LikeRequest
    {
        public int like { get; set; }
        public int id { get; set; }
    }
}
