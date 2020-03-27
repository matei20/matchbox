import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { observer } from "mobx-react/native";
import WithAppNav from "../navs/app";
import { action, toJS } from 'mobx';
import store from '../store';

@observer
class ChatScreen extends React.Component {

    @action
    onSend(messages = []) {
        console.log("onsend===============================");
        console.log(messages);
        const objToSend = new Object();
        objToSend.otherClientID = store.ws.currentConvOtherUserId;
        objToSend.message = messages[0];
        console.log(objToSend);
        store.ws.wSocket.send(JSON.stringify(objToSend));
        store.ws.myObj[String(store.ws.currentConvOtherUserId)].messages.push(messages[0]);
        //console.log(store.ws.myObj[String(store.ws.currentConvOtherUserId)].messages);
        //var d = new Date();
        //console.log(JSON.stringify(d.getTime()));
        //console.log(this.state.messages);
        console.log("end-onsend===============================");

    }

    render() {
        return (
            <GiftedChat
                messages={toJS(store.ws.myObj[String(store.ws.currentConvOtherUserId)].messages)}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: store.ws.id,
                }}
                inverted={false}
                isTyping={true}
            />
        )
    }
}

export default WithAppNav(ChatScreen);