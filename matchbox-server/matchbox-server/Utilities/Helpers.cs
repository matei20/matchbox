using Oracle.ManagedDataAccess.Client;
using System.Data;
using Microsoft.Extensions.Configuration;
using System.Device.Location;


namespace MatchboxServer.Utilities
{
    public static class MatchboxConnection
    {
        
        static IDbConnection conn = new OracleConnection("data source=localhost:1521/orcl;password=match;user id=c##match;Incr Pool Size=5;Decr Pool Size=2;");
        public static IDbConnection GetConnection(IConfiguration configuration)
        {
            var connectionString = configuration.GetSection("ConnectionStrings").GetSection("MatchboxConnection").Value;
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
