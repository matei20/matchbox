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
        //console.log(messages);//debugging

        const objToSend = {};
        objToSend.otherClientID = store.ws.otherUserId;
        objToSend.message = messages[0];

        store.ws.wSocket.send(JSON.stringify(objToSend));
        const currentConvOtherUserId = store.ws.otherUserId.toString();
        store.ws.addMessageToConversations(currentConvOtherUserId, messages[0]);
    }

    render() {
        const currentConvOtherUserId = store.ws.otherUserId.toString();
        const messages = store.ws.conversations[currentConvOtherUserId] ? toJS(store.ws.conversations[currentConvOtherUserId].messages) : [];

        return (
            <GiftedChat
                messages={messages}
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