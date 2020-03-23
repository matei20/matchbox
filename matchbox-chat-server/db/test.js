const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
oracledb.outFormat = oracledb.OBJECT;
const numRows = 10;  // number of rows to return from each call to getRows()

async function run() {
    console.log(Date.now());
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `BEGIN
         USP_GETUSERINFO(:id, :cursor);
       END;`,
            {
                id: 301,
                cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            });

        console.log("Cursor metadata:");
        var u =  await result.outBinds.cursor.getRow();
        u = JSON.stringify(u);
        console.log(u);
      
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

run();