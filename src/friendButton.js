import React from 'react';
import axios from './axios';



export default class FriendButton extends React.Component{
    constructor(){
        super();
        this.sendFriendRequest= this.sendFriendRequest.bind(this);
        this.acceptFriendRequest =this.acceptFriendRequest.bind(this);
        this.deleteFriendship=this.deleteFriendship.bind(this);
        this.state={};
    }
    componentDidMount(){

        axios.get('/friends/' + this.props.otherUserId).then(resp=>{

            //not friends, i.e. empty array of data:
            if(resp.data.data.length==0){
                console.log('no friendship');
                this.setState({status:"noFriendship"});
            }
            //if friends accepted=true:
            else if(resp.data.data[0].accepted==true){
                console.log("friends!!!");
                this.setState({status:'friends'});
            }
            //if friends accepted=false:
            else if(resp.data.data[0].accepted==false && resp.data.user!==resp.data.data[0].sender_id){
                console.log("not accepted yet");
                this.setState({status:'pending'});
            }
            else if(resp.data.data[0].accepted==false && resp.data.user==resp.data.data[0].sender_id){
                console.log("withdraw possible");
                this.setState({status:'withdraw'});
            }

        } ).then(()=>{console.log("this.state from friends", this.state);

        });


    }
    sendFriendRequest(){
        axios.post('/friendrequest/'+ this.props.otherUserId).then(resp=>{
            //console.log("resp from /friendrequest", resp.data.data[0]));
            this.setState(resp.data.data[0]);
            //andra status pa knapp
            this.setState({status:'withdraw'});
        });
    }
    acceptFriendRequest(){

        axios.post('/acceptfriend/'+ this.props.otherUserId).then(resp=>{
            console.log("resp from /acceptfriend", resp.data);
            //change content of button immediately
            this.setState({status:'friends'});
        });

    }
    deleteFriendship(){
        axios.post('/deletefriends/'+this.props.otherUserId).then(resp=>{
            console.log("from delete fs", resp);
            this.setState({status:'noFriendship'});
        });
    }

    render(){
        return(
            <div className="friend-container">
                {this.state.status=='noFriendship' &&
                    <button onClick={this.sendFriendRequest} name='friend' > send a friend request </button>}
                {this.state.status==='pending' && <button onClick={this.acceptFriendRequest} name='friend' > accept friend request </button>}
                {this.state.status==='withdraw' && <button onClick={this.deleteFriendship} name='friend' > cancel request </button>}
                {this.state.status==='friends' && <button onClick={this.deleteFriendship} name='friend' > delete friendship </button>}
            </div>
        );
    }
}
