const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
oracledb.outFormat = oracledb.OBJECT;

class Db {
    constructor() {
        this.connection = null;
        this.connect = this.connect.bind(this);
        this.close = this.close.bind(this);
    }

    async connect() {
        //console.log("connected to db");
        this.connection = await oracledb.getConnection(dbConfig);
    }

    async close() {
        await connection.close();
    }

    async saveMessageToDb(senderID, receiverID, message, unread) {
        // console.log("save message"); //debugging
        // console.log(message);
        try {
            const result = await this.connection.execute(
                `BEGIN
         USP_ADDMESSAGE(:p_id,
                        :p_sender_id,
                        :p_receiver_id,
                        :p_created_at,
                        :p_message_text,
                        :p_unread,
                        :cursor);
       END;`,
                {
                    p_id: message._id,
                    p_sender_id: senderID,
                    p_receiver_id: receiverID,
                    p_created_at: message.createdAt,
                    p_message_text: message.text,
                    p_unread: unread,
                    cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
                },
                { autoCommit: true });

            let u = await result.outBinds.cursor.getRow();
            console.log("message " + u.ID + " successfully saved");// debugging log

        } catch (err) {
            console.error(err);
        }
    }

}

module.exports = new Db();
