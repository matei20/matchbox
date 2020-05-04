using Dapper;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using MatchboxServer.Interfaces;
using MatchboxServer.Utilities;
using MatchboxServer.Models;
using Microsoft.Extensions.Configuration;

namespace MatchboxServer.Repositories
{
    public class AuthenticationRepository:IAuthentication
    {

        IConfiguration configuration;
        public AuthenticationRepository(IConfiguration _configuration)
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
                var conn = MatchboxConnection.GetConnection(this.configuration);
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
                            flag = 1;
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

                    var conn = MatchboxConnection.GetConnection(this.configuration);
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
        //delete user
        public dynamic DeleteUser(int id)
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
    }
}
