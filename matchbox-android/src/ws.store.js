import { observable, action, toJS } from "mobx";
import bind from "bind-decorator";
import jwt_decode from "jwt-decode";
import { kApiBaseUrl, wsNodeUrl } from "./constants/api";

class wsStore {
    @observable token = null;
    user_id;
    @observable wSocket;// = new WebSocket(URL, "", { headers: { 'token': token } });
    @observable otherUserId;
    wasInitialized = false;
    @observable conversations = {};
    @observable areUnreadedMessages = 0;

    @action.bound
    initConversations(response) {
        this.wasInitialized = true;
        //console.log(response);
        this.conversations = response.map(m => ({
            sender_id: m.SENDER_ID,
            receiver_id: m.RECEIVER_ID,
            unread: m.UNREAD,
            message: {
                _id: m.ID,
                createdAt: m.CREATEDAT,
                user: {
                    _id: m.SENDER_ID,
                    avatar: `${kApiBaseUrl}/download-image/${m.SENDER_ID}.jpg`
                },
                text: m.MESSAGE_TEXT
            },


        })).reduce((acc, obj) => {
            let key = (obj.sender_id === this.user_id) ? obj.receiver_id.toString() : obj.sender_id.toString();
            if (!acc[key]) {
                acc[key] = { unreadCount: 0, messages: [] }
            }

            if (obj.unread && (obj.receiver_id === this.user_id))
                acc[key].unreadCount++;
            acc[key].messages.push(obj.message);
            return acc
        }, {});

        return;
    }

    @action.bound
    addMessageToConversations(convID, message) {

        if (this.conversations[convID.toString()] === undefined) {
            const newConv = { [convID.toString()]: { unreadCount: 1, messages: [] } };
            this.conversations = { ...this.conversations, ...newConv };
        }
        this.conversations[convID.toString()].messages.push(message);
    }
    @bind
    newconnection(token) {
        this.token = token;
        const payload = jwt_decode(token);
        this.user_id = payload.ID;
        this.wSocket = new WebSocket(wsNodeUrl, "", { headers: { 'token': this.token } });
        this.wSocket.onopen = () => {
            // on connecting, do nothing
            //console.log('connected'); //debugging
        }

        this.wSocket.onmessage = action(evt => {
            // on receiving a message, add it to the list of messages
            const reqObj = JSON.parse(evt.data)
            if (reqObj.otherClientID != undefined) {
                reqObj.message.user.avatar = `${kApiBaseUrl}/download-image/${reqObj.message.user._id}.jpg`;

                this.addMessageToConversations(reqObj.otherClientID, reqObj.message);
                //console.log("onmessage app ==================="); //debugging
            }
        })
        this.wSocket.onclose = () => {
            console.log('disconnected');
        }
    }
    @action
    closeconnection() {
        this.wSocket.close()
    }
}

export default new wsStore();
