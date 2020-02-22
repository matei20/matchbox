using Core2API.Oracle;
using Dapper;
using Microsoft.Extensions.Configuration;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;


namespace Core2API.Repositories
{
    public class TokenRequest
    {
        public string token{ get; set; }
    }
    public class RegisterRequest
    {
        public string email { get; set; }
        public string password { get; set; }
        public string rePassword { get; set; }
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

    public class Repository : IRepository
    {
        IConfiguration configuration;
        public Repository(IConfiguration _configuration)
        {
            configuration = _configuration;
        }
        //login
        public dynamic Login(LoginRequest request)
        {
            dynamic result = null;
            string encrypted = Sha256.CalculateSHA256Hash(request.password);
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_email", OracleDbType.Varchar2, ParameterDirection.Input, request.email, request.email.Length * sizeof(Char));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);
                var conn = this.GetConnection();
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_GETUSER";
                    result = SqlMapper.Query(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                 //throw ex;
                result = "ERROR";
            }
            int flag = 0;
            foreach (IDictionary<string, object> row in result)
            {
                foreach (var pair in row)
                {
                    var num = pair.Key;
                    var val = pair.Value;
                    if (num == "PASSWORD")

                    {
                        if (encrypted == val.ToString())
                            flag = 1 ;
                    }
                }
            }
            if (flag == 1)
                return result;
            else
                return "Not Matching";
        }
        //register
        public dynamic Register(RegisterRequest request)
        {
            dynamic result = null;
            if (request.password != request.rePassword)
                return "Password not matching";
            else
            {
                string encrypted = Sha256.CalculateSHA256Hash(request.password);
                try
                {
                    var dyParam = new OracleDynamicParameters();
                    dyParam.Add("p_email", OracleDbType.Varchar2, ParameterDirection.Input, request.email, request.email.Length * sizeof(Char));
                    dyParam.Add("p_password", OracleDbType.Varchar2, ParameterDirection.Input, encrypted, encrypted.Length * sizeof(Char));
                    dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);

                    var conn = this.GetConnection();
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    if (conn.State == ConnectionState.Open)
                    {
                        var query = "USP_ADDUSER";
                        result = SqlMapper.Query(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                    }
                }
                catch (Exception ex)
                {
                    // throw ex;
                    string errorCode = ex.Message.Split(':')[0];
                    if (errorCode == "ORA-02290")
                        result = "Email format incorrect";
                    else if (errorCode == "ORA-00001")
                        result = "This email is already used";
                    else
                        result = "Error";
                }
                return result;
            }
        }
        //GetUserInfo
        public dynamic GetInfo(int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("id_in", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);
                var conn = this.GetConnection();
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_GETUSERINFO";
                    result = SqlMapper.Query(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                // throw ex;
                result = "ERROR";
            }
            return result;
        }
        //set user info
        public dynamic SetUserInfo(UserInfoRequest request,int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_id", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("p_name", OracleDbType.Varchar2, ParameterDirection.Input, request.name, request.name.Length * sizeof(Char));
                dyParam.Add("p_age", OracleDbType.Int32, ParameterDirection.Input, request.age, sizeof(Int32));
                dyParam.Add("p_gender", OracleDbType.Varchar2, ParameterDirection.Input, request.gender, request.gender.Length * sizeof(Char));
                dyParam.Add("p_school", OracleDbType.Varchar2, ParameterDirection.Input, request.school, request.school.Length * sizeof(Char));
                dyParam.Add("p_job", OracleDbType.Varchar2, ParameterDirection.Input, request.job, request.job.Length * sizeof(Char));
                dyParam.Add("p_company", OracleDbType.Varchar2, ParameterDirection.Input, request.company, request.company.Length * sizeof(Char));
                dyParam.Add("p_description", OracleDbType.Varchar2, ParameterDirection.Input, request.description, request.description.Length * sizeof(Char));

                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);

                var conn = this.GetConnection();
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_SETUSERINFO";
                    result = SqlMapper.Query(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                // throw ex;
                result = "ERROR";
            }
            return result;
        }
        //GetMatch
        public dynamic GetMatch(int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_id", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);
                var conn = this.GetConnection();
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_GETMATCH";
                    result = SqlMapper.Query(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                // throw ex;
                result = "ERROR";
            }
            return result;
        }
        //set like
        public dynamic SetLike(LikeRequest request, int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_from_user", OracleDbType.Int32, ParameterDirection.Input,id, sizeof(Int32));
                dyParam.Add("p_to_user", OracleDbType.Int32, ParameterDirection.Input, request.id, sizeof(Int32));
                dyParam.Add("p_like_box", OracleDbType.Int32, ParameterDirection.Input, request.like, sizeof(Int32));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);

                var conn = this.GetConnection();
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_SETLIKE";
                    result = SqlMapper.Query(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                // throw ex;
                result = "ERROR";
            }
            return result;
        }
        //delete user
        public dynamic DeleteUser(int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_id", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);
                var conn = this.GetConnection();
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_DELETEUSER";
                    result = SqlMapper.Query(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                // throw ex;
                result = "ERROR";
            }
            return result;
        }
        //get all matches 
        public dynamic Matches(int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_id", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);
                var conn = this.GetConnection();
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_MATCHES";
                    result = SqlMapper.Query(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                // throw ex;
                result = "ERROR";
            }
            return result;
        }
        //employees
        public object GetEmployeeDetails(int empId)
        {
            object result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("EMP_ID", OracleDbType.Int32, ParameterDirection.Input, empId);
                dyParam.Add("EMP_DETAIL_CURSOR", OracleDbType.RefCursor, ParameterDirection.Output);

                var conn = this.GetConnection();
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_GETEMPLOYEEDETAILS";
                    result = SqlMapper.Query(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return result;
        }

        public object GetEmployeeList()
        {
            object result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();

                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);

                var conn = this.GetConnection();
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }

                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_GETEMPLOYEES";

                    result = SqlMapper.Query(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return result;
        }
        public IDbConnection GetConnection()
        {
            var connectionString = configuration.GetSection("ConnectionStrings").GetSection("MatchboxConnection").Value;
            var conn = new OracleConnection(connectionString);
            return conn;
        }
    }
}