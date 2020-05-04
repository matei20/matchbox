using MatchboxServer.Models;

namespace MatchboxServer.Interfaces
{
    public interface IAuthentication
    {
        dynamic Register(RegisterRequest request);//email and 2xpassword and return id
        dynamic Login(LoginRequest request);//email and password return id
        dynamic DeleteUser(int id);//delete user
    }
}
