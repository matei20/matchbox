import { observable, action } from "mobx";
import bind from "bind-decorator";
import jwt_decode from "jwt-decode";
import { kApiBaseUrl } from "./constants/api";

const URL = 'ws://192.168.1.4:5000';

class wsStore {
    @observable token = null;
    user_id;
    @observable wSocket;// = new WebSocket(URL, "", { headers: { 'token': token } });
    @observable currentConvOtherUserId;
    @observable myObj = {
        "318": {
            "unreadCount": 4,
            "messages": [
                {
                    "text": "Buna",
                    "user": { "_id": 402, "name": 'EU' },
                    "createdAt": "2020-02-23T11:47:43.917Z",
                    "_id": "559cbd9d-b471-46dd-850a-f7934d6538d1"
                },

                {
                    "text": "Ook",
                    "user": { "_id": 318, "name": 'React Native' },
                    "createdAt": "2020-02-23 11:47:43.917Z",
                    "_id": "559cbd9d-b471-46dd-850a-f7934d6538d2"
                },
                {
                    "text": "Ook22222",
                    "user": { "_id": 318, "name": 'React Native' },
                    "createdAt": new Date(1584964063917),
                    "_id": "559cbd9d-b471-46dd-850a-f7934d6538d3"
                }

            ]

        },
        "305": {
            "unreadCount": 0,
            "messages": []
        },
        "402": {
            "unreadCount": 0,
            "messages": []
        }
    };

    @observable conversations;
    @bind
    newconnection(token) {
        console.log(this.myObj["318"].unreadCount);
        this.token = token;
        const payload = jwt_decode(token);
        this.user_id = payload.ID; 
        this.wSocket = new WebSocket(URL, "", { headers: { 'token': this.token } });
        this.wSocket.onopen = () => {
            // on connecting, do nothing
            //console.log('connected'); //debugging
        }

        this.wSocket.onmessage = action(evt => {
            // on receiving a message, add it to the list of messages
            const reqObj = JSON.parse(evt.data)
            if (reqObj.otherClientID != undefined) {
                let obj = new Object;
                obj._id = reqObj.message.user._id;
                obj.avatar = `${kApiBaseUrl}/download-image/${obj._id}.jpg`;
                reqObj.message.user = obj;
                this.myObj[String(reqObj.otherClientID)].messages.push(reqObj.message);
                //console.log("onmessage app ==================="); //debugging
            }
        })
        this.wSocket.onclose = () => {
            //console.log('disconnected')

        }
    }
    @action
    closeconnection() {
        this.wSocket.close()
    }
}

export default new wsStore();