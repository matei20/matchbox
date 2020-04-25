using Oracle.ManagedDataAccess.Client;
using System.Data;
using Microsoft.Extensions.Configuration;
using System.Device.Location;


namespace MatchboxServer.Utilities
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
    public static class MatchboxConnection
    {
        
        public static IDbConnection GetConnection(IConfiguration configuration)
        {
            var connectionString = configuration.GetSection("ConnectionStrings").GetSection("MatchboxConnection").Value;
            var conn = new OracleConnection(connectionString);
            return conn;
        }
    }
    public class GeoLocation
    {

        public static double distanceBetweenTwoUsers(double lat1, double lng1, double lat2, double lng2)
        {
            GeoCoordinate pin1 = new GeoCoordinate(lat1, lng1);
            GeoCoordinate pin2 = new GeoCoordinate(lat2, lng2);

            double distanceBetween = pin1.GetDistanceTo(pin2);
            return distanceBetween;
        }
    }
}
