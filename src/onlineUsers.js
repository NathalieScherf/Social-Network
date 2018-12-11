import React from 'react';

import { connect } from 'react-redux';
//TO DO: change actions
//import { getOnlineUsers } from './actions';

class OnlineUsers extends React.Component {
    componentDidMount() {

        this.goToFriend=this.goToFriend.bind(this);
    }
    goToFriend(id){
        console.log("id of your friend", id);
        location.replace('/user/'+id);

    }

    render() {
        return (
            <div className='friendsAndWannabes'>
                <h1>These users  are  online now:</h1>
                <div className='friends'>
                    {this.props.onlineUsers && this.props.onlineUsers.map(
                        onlineUser => {
                            return (
                                <div className='people' key={onlineUser.id} >

                                    <img onClick={() => this.goToFriend(onlineUser.id)} src={onlineUser.profilepic||"/profile_default.png"} />

                                    <h3>{onlineUser.first} {onlineUser.last}</h3>

                                </div>
                            );
                        }
                    )}
                </div>

            </div>
        );
    }
}




// react integration

function mapStateToProps(state) {
    var onlineUsers = state.onlineUsers;
    
    return {
        onlineUsers: onlineUsers,

    };
}


export default connect(mapStateToProps)(OnlineUsers);
