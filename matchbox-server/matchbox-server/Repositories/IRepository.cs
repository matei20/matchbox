namespace Core2API.Repositories
{ 
    public interface IRepository
    {
        dynamic Register(RegisterRequest request);//email and 2xpassword and return id
        dynamic Login(LoginRequest request);//email and password return id
        dynamic GetInfo(int id);//id from token and return info about user
        dynamic SetUserInfo(UserInfoRequest request,int id);//set user information
        dynamic GetMatch(int id);//get random user 
        dynamic SetLike(LikeRequest request,int id);//set like state 
        dynamic DeleteUser(int id);//delete user
        object GetEmployeeList();
        object GetEmployeeDetails(int empId);
        dynamic Matches(int id);
    }
}
