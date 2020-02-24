using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IdentityModel;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace Core2API.Repositories
{
    public class ID
    {
        public string id { get; set; }
        public string email { get; set; }
    }
    public class Jwt
    {
        static string key = "401b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b3727429090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1";
        private static TokenValidationParameters GetValidationParameters()
        {
            return new TokenValidationParameters()
            {
                ValidateLifetime = false, // Because there is no expiration in the generated token
                ValidateAudience = false, // Because there is no audiance in the generated token
                ValidateIssuer = false,   // Because there is no issuer in the generated token
                ValidIssuer = "Sample",
                ValidAudience = "Sample",
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)) // The same key as the one that generate the token
        };
        }
        private static bool ValidateToken(string authToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = GetValidationParameters();
            SecurityToken validatedToken;
            try
            {
                IPrincipal principal = tokenHandler.ValidateToken(authToken, validationParameters, out validatedToken);

            }
            catch (Exception jwt_ex)
            {
                // throw jwt_ex;
                return false;
            }
            return true;
        }

        public static object GenerateToken(dynamic input)
        {
            var securityKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

            var credentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
            var header = new JwtHeader(credentials);
            var payload = new JwtPayload();
            foreach (IDictionary<string, object> row in input)
            {
                foreach (var pair in row)
                {
                    var num = pair.Key;
                    var val = pair.Value;
                    if(num == "ID" || num =="EMAIL")
                        payload.Add(num, val);
                }
            }
            var secToken = new JwtSecurityToken(header, payload);
            var handler = new JwtSecurityTokenHandler();

            var tokenString = handler.WriteToken(secToken);
            //Get_Id("eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6MzAwMy4wLCJFTUFJTCI6ImdhYnJpZWxtYXRlaTJAZ21haWwuY29tIn0.0YGk0PrCbkuhjdSHrG8YQ9oEpiNOh4YNxWqO36xMO28");
            return tokenString;
        }
        public static int GetIdFromToken(string Token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = GetValidationParameters();
            SecurityToken validatedToken;
            try
            {
                IPrincipal principal = tokenHandler.ValidateToken(Token, validationParameters, out validatedToken);

                var claimsIdentity = (ClaimsIdentity)principal.Identity;
                var pairs = new Dictionary<string, string>();
                foreach (Claim claim in claimsIdentity.Claims)
                {
                    var a = claim.Value;
                    string[] sresult = a.Split('.');
                    int result = Int32.Parse(sresult[0]);
                    return result;
                }
            }
            catch (Exception ex)
            {
                //throw ex;
                return 0;
            }
            return 0;
        }

    }
        
}
