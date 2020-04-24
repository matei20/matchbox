using MatchboxServer.Utilities;

namespace MatchboxServer.Interfaces
{
    public interface IUserInfo
    {
        dynamic GetInfo(int id);//id from token and return info about user
        dynamic SetUserInfo(UserInfoRequest request, int id);//set user information
        dynamic GetMatch(int id);//get random user 
        dynamic SetLike(LikeRequest request, int id);//set like state 
        dynamic Matches(int id);
        dynamic SetUserLocationInfo(LocationRequest request, int id);
        dynamic GetUserLocationInfo(int id);
        dynamic GetUserConversations(int id);
        dynamic GetUserMaxDistance(int id);
    }
}
