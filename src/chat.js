import React from 'react';
import{ connect } from 'react-redux';
import {initSocket} from './socket';

class Chat extends React.Component{
    constructor(){
        super();
    }
    sendMessage(e){
        let socket = initSocket();
        if(e.which===13){
            console.log("message was sent", e.target.value);
            socket.emit('chatMessage', e.target.value);
        }
    }
    componentDidUpdate(){
        //need to add some code here 
        console.log("update", this.elem);
        this.elem.scrollTop=this.elem.scrollHeight;
    }

    render(){

        return(
            <div>

                <h1>Chat running!</h1>
                <div className='chat-messages-contianer'
                    ref={elem => (this.elem = elem)}>
                    <p>text</p>
                    <p>text</p>
                    <p>text</p>
                    <p>text</p>
                </div>
                <textarea onKeyDown={ this.sendMessage } />
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log(state);
    return {


    };
}


export default connect(mapStateToProps)(Chat);
