using System;
using System.Security.Cryptography;
using System.Text;

namespace MatchboxServer.Utilities
{
    public class Sha256
    {
        public static string CalculateSHA256Hash(string text)
        {
            Encoding UE = new UTF8Encoding();

            byte[] hashValue;
            byte[] message = UE.GetBytes(text);

            SHA256Managed hashString = new SHA256Managed();
            string hex = "";

            hashValue = hashString.ComputeHash(message);
            foreach (byte x in hashValue)
            {
                hex += String.Format("{0:x2}", x);
            }
            return hex;
        }
    }
}
