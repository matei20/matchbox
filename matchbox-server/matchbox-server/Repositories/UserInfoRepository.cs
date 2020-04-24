using Dapper;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Data;
using MatchboxServer.Utilities;
using MatchboxServer.Interfaces;
using Microsoft.Extensions.Configuration;

namespace MatchboxServer.Repositories
{
    
    public class UserInfoRepository : IUserInfo
    {
        IConfiguration configuration;
        public UserInfoRepository(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        //GetUserConversations
        public dynamic GetUserConversations(int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_id", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);
                var conn = MatchboxConnection.GetConnection(this.configuration);
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_CONVERSATIONS";
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

        //GetUserInfo
        public dynamic GetInfo(int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("id_in", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);
                var conn = MatchboxConnection.GetConnection(this.configuration);
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
                dyParam.Add("p_minAge", OracleDbType.Int32, ParameterDirection.Input, request.minAge, sizeof(Int32));
                dyParam.Add("p_maxAge", OracleDbType.Int32, ParameterDirection.Input, request.maxAge, sizeof(Int32));
                dyParam.Add("p_maxDistance", OracleDbType.Int32, ParameterDirection.Input, request.maxDistance, sizeof(Int32));
                dyParam.Add("p_gender", OracleDbType.Varchar2, ParameterDirection.Input, request.gender, request.gender.Length * sizeof(Char));
                dyParam.Add("p_school", OracleDbType.Varchar2, ParameterDirection.Input, request.school, request.school.Length * sizeof(Char));
                dyParam.Add("p_job", OracleDbType.Varchar2, ParameterDirection.Input, request.job, request.job.Length * sizeof(Char));
                dyParam.Add("p_company", OracleDbType.Varchar2, ParameterDirection.Input, request.company, request.company.Length * sizeof(Char));
                dyParam.Add("p_description", OracleDbType.Varchar2, ParameterDirection.Input, request.description, request.description.Length * sizeof(Char));

                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);

                var conn = MatchboxConnection.GetConnection(this.configuration);
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

        //set user location info
        public dynamic SetUserLocationInfo(LocationRequest request, int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_id", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("p_country", OracleDbType.Varchar2, ParameterDirection.Input, request.country, request.country.Length * sizeof(Char));
                dyParam.Add("p_city", OracleDbType.Varchar2, ParameterDirection.Input, request.city, request.city.Length * sizeof(Char));
                dyParam.Add("p_latitude", OracleDbType.Varchar2, ParameterDirection.Input, request.latitude, request.latitude.Length * sizeof(Char));
                dyParam.Add("p_longitude", OracleDbType.Varchar2, ParameterDirection.Input, request.longitude, request.longitude.Length * sizeof(Char));

                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);

                var conn = MatchboxConnection.GetConnection(this.configuration);
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_SETUSERLOCATIONINFO";
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

        //get user location
        public dynamic GetUserLocationInfo(int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_id", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);
                var conn = MatchboxConnection.GetConnection(this.configuration);
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_GETUSERLOCATIONINFO";
                    result = SqlMapper.QuerySingle(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                // throw ex;
                result = "ERROR";
            }

            return result;
        }

        //get user maxdistance
        public dynamic GetUserMaxDistance(int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_id", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);
                var conn = MatchboxConnection.GetConnection(this.configuration);
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                if (conn.State == ConnectionState.Open)
                {
                    var query = "USP_GETUSERMAXDISTANCE";
                    result = SqlMapper.QuerySingle(conn, query, param: dyParam, commandType: CommandType.StoredProcedure);
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
                var conn = MatchboxConnection.GetConnection(this.configuration);
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

                var conn = MatchboxConnection.GetConnection(this.configuration);
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
        
        //get all matches 
        public dynamic Matches(int id)
        {
            dynamic result = null;
            try
            {
                var dyParam = new OracleDynamicParameters();
                dyParam.Add("p_id", OracleDbType.Int32, ParameterDirection.Input, id, sizeof(Int32));
                dyParam.Add("cursorParam", OracleDbType.RefCursor, ParameterDirection.Output);
                var conn = MatchboxConnection.GetConnection(this.configuration);
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

    }
}