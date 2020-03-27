const jwt = require('jsonwebtoken');
const key = "401b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b3727429090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1";
const buf2 = Buffer.from(key, "utf-8");
//token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6NDAyLjAsIkVNQUlMIjoic2ltb25AZ21haWwuY29tIn0.x5_2pKG_A9jfgF60p0mAXV9ZVTAIWCuI_hqcJGpzEPk";

function verifyAndDecode(token) {
    const decoded = jwt.verify(token, buf2, { algorithms: ['HS256'] });
    
    console.log("==============");
    console.log(decoded);
    console.log("==============");
    return decoded;
}

module.exports = { verifyAndDecode };
