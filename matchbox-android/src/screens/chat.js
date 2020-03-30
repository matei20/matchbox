import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { observer } from "mobx-react/native";
import WithAppNav from "../navs/app";
import { action, toJS } from 'mobx';
import store from '../store';
import { kApiBaseUrl } from "../constants/api";

@observer
class ChatScreen extends React.Component {

    @action
    onSend(messages = []) {
        //console.log(messages);//debugging
        const objToSend = new Object();
        objToSend.otherClientID = store.ws.currentConvOtherUserId;
        objToSend.message = messages[0];

        store.ws.wSocket.send(JSON.stringify(objToSend));
        store.ws.myObj[String(store.ws.currentConvOtherUserId)].messages.push(messages[0]);//store message
    }

    render() {
        return (
            <GiftedChat
                messages={toJS(store.ws.myObj[String(store.ws.currentConvOtherUserId)].messages)}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: store.ws.user_id,
                }}
                inverted={false}
            />
        )
    }
}

export default WithAppNav(ChatScreen);