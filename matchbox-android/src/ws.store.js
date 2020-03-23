import { observable, action, computed } from "mobx";
import bind from "bind-decorator";
import store from "./store";
const URL = 'ws://192.168.1.4:5000';

class wsStore {
    @observable token = null;
    @observable ws;// = new WebSocket(URL, "", { headers: { 'token': token } });
    @observable currentConvOtherUserId;
    myObj = {
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
                },
                
            ]

        }
    };

    @observable conversations;
    @bind
    newconnection(token) {
        console.log(this.myObj["318"].unreadCount);
        this.token = token;
        this.ws = new WebSocket(URL, "", { headers: { 'token': this.token } });
        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log("onopen app ===================");
            console.log('connected')
        }
        this.ws.onmessage = evt => {
            // on receiving a message, add it to the list of messages
            const message = JSON.parse(evt.data)
            console.log("onmessage app ===================");
            console.log(message);
            //this.addMessage(message)
        }
        this.ws.onclose = () => {
            //console.log('disconnected')

        }
    }
    @action
    closeconnection() {
        this.ws.close()
    }
}

export default new wsStore();