import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import WithAppNav from "../navs/app";
import { observer } from "mobx-react/native";

import store from '../store';

class ChatScreen extends React.Component {

    state = {
        messages: [{
            _id: Math.round(Math.random() * 1000000),
            text: '#awesome',
            createdAt: new Date(),
            user: {
                _id: 1,
                name: 'Developer',
            },
        },],
    }

    componentDidMount() {
        var idd =String(store.ws.currentConvOtherUserId);
        this.setState({
            messages: store.ws.myObj[idd].messages,
        });
        
        console.log("chatt===================" + store.ws.currentConvOtherUserId);
        console.log(store.ws.myObj[idd].messages);
    }

    onSend(messages = []) {
        console.log(messages[0]);
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
        var d = new Date();
        console.log(JSON.stringify(d.getTime()));
        this.onReceive("primit");
        console.log(this.state.messages);
    }

    onReceive(text) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, {
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    createdAt: new Date(),
                    user: {
                        _id: 318,
                        name: 'React Native',
                        // avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                }),
            };
        });
    }
    render() {
        //const {convOtherUserId}=this.props;

        // if (this.id == 402) {
        //     const message1 = { otherClientID: 318, text: "aaaaaa" };
        //     console.log("obj===================obj");
        //     console.log(JSON.stringify(message1));
        //     this.ws.send(JSON.stringify(message1));
        // }
        return (

            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 402,
                }}
            />
        )
    }
}

export default WithAppNav(observer(ChatScreen));


// // app/screens/Chat.js
// import React from 'react';
// import {
//     Text,
//     TextInput,
//     StyleSheet,
//     View
// } from 'react-native';

// class Chat extends React.Component {

//     constructor(props) {

//         super(props);
//         this.state = {
//             chatMessage: "",
//             chatMessages: []
//         };
//     }
//     componentDidMount() {
//         // const { token } = stor.user;
//         // this.ws = new WebSocket(URL, "", { headers: { 'token': token } });
//         // this.ws.onopen = () => {
//         //     // on connecting, do nothing but log it to the console
//         //     console.log("onopen app ===================");
//         //     console.log('connected')
//         // }

//         // this.ws.onmessage = evt => {
//         //     // on receiving a message, add it to the list of messages
//         //     const message = JSON.parse(evt.data)
//         //     console.log("onmessage app ===================");
//         //     console.log(message);
//         //     //this.addMessage(message)
//         // }

//         // this.ws.onclose = () => {
//         //     console.log('disconnected')
//         //     // automatically try to reconnect on connection loss
//         //     this.setState({
//         //         ws: new WebSocket(URL),
//         //     })
//         // }
//     }
//     render() {
//         const chatMessages = this.state.chatMessages.map(chatMessage => (
//             <Text style={{ borderWidth: 2, top: 500 }}>{chatMessage}</Text>
//         ));

//         return (
//             <View style={styles.container}>
//                 {chatMessages}
//                 <TextInput
//                     style={{ height: 40, borderWidth: 2, top: 100 }}
//                     autoCorrect={false}
//                     value={this.state.chatMessage}
//                     onSubmitEditing={() => this.submitChatMessage()}
//                     onChangeText={chatMessage => {
//                         this.setState({ chatMessage });
//                     }}
//                 />
//             </View>
//         );
//     }

//     submitChatMessage() {
//         //this.socket.emit('chat message', this.state.chatMessage);
//         //this.setState({ chatMessage: '' });
//         console.log("END  EDITING");
//     }

// }
// const styles = StyleSheet.create({
//     container: {
//         height: 400,
//         flex: 1,
//         backgroundColor: '#F5FCFF',
//     },
// });

//export default Chat;