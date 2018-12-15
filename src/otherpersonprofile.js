import React from 'react';
import axios from './axios';

import {Link} from 'react-router-dom';
import FriendButton from './friendButton';
export default class OtherPersonProfile extends React.Component{
    constructor(){
        super();
        this.state={};
    }
    componentDidMount(){
        axios.get('/user/'+this.props.match.params.id +'/json' ).then(resp=>{
            //resp.data check it and redirect
            console.log(resp.data);
            if(resp.data.status=='sameUser'){
                console.log('redirect');
                location.replace('/');
            }
            if(resp.data.success=== false){
                console.log('redirecting nonsense user');
                this.props.history.push('/');
                //location.replace('/');
            }
            else{
                this.setState(resp.data);}

        });

    }
    render(){
        return (
            <div className='opp-container'>

                
                <div className='profile'>
                    <h4> You are visiting: {this.state.first} {this.state.last}</h4>
                    {this.state.profilePicUrl == null && <div className='otherImg'>
                        <img className='smallimg' src={"/profile_default.png"} />
                    </div>}
                    <div className='otherImg'>
                        <img className='smallimg' src={this.state.profilePicUrl} />
                    </div>
                    <FriendButton otherUserId ={this.props.match.params.id} />

                    <div className='bio-text'>
                        <p>Bio:</p>
                        <p>{this.state.bio}</p>
                    </div>
                </div>
            </div>

        );
    }
}
/*
Part 6: friendships:
<FriendButton otherUserId =(this.props.match.params.id} />
accepted has  to be false, in order to make friend request.
in component: friendButton:
when mounted:get route: select- request
pass to reoute, id of other user, present user is known in res.session.userId
sends back accapted, reciever id,
render button depending on response, click on button trigger one of the following routes.

they all need id of otherUserId
also need: post routes for: insert, updata, delete,
last: updata state fo reflect new status.
*/
