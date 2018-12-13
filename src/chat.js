import React from 'react';
import{ connect } from 'react-redux';
import {initSocket} from './socket';
import Timestamp from 'react-timestamp';
class Chat extends React.Component{
    constructor(){
        super();
    }
    sendMessage(e){
        let socket = initSocket();
        if(e.which===13){
            console.log("message was sent", e.target.value);
            socket.emit('newMsg', e.target.value);
            e.target.value ='';
            e.preventDefault();
        }
    }
    /*    componentDidUpdate(){
        //need to add some code here
        console.log("update", this.elem);
        this.elem.scrollTop=this.elem.scrollHeight;
    }*/

    render(){

        return(
            <div>

                <h1>Join the chat!</h1>

                <div className='chat-messages-contianer'
                    ref={elem => (this.elem = elem)}>
                    {this.props.messages && this.props.messages.map(
                        (message, idx) => {
                            return (
                                <div className='oldMessages' key={idx} >

                                    <img onClick={() => this.goToFriend(message.id)} src={message.profilepic||"/profile_default.png"} />
                                    <div className='chatInfo'>
                                        <h3>{message.first} {message.last}</h3>
                                        <p>{message.message}</p>
                                        <Timestamp time={message.created_at} precision={2} />

                                    </div>
                                </div>

                            );
                        }
                    )}
                </div>
                <h1>Add your comment </h1>
                <textarea onKeyDown={ this.sendMessage } />
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log("state from chat", state);
    var messages =state.chatMessages;

    return {
        messages: messages,

    };
}


export default connect(mapStateToProps)(Chat);
