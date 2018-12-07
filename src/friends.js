import React from 'react';
//import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { receiveFriendsAndWannabes, unfriend, acceptFriendRequest } from './actions';

class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(receiveFriendsAndWannabes());
    }


    render() {
        return (
            <div className='friendsAndWannabes'>
                <h1>These are your friends</h1>

                {this.props.friends && this.props.friends.map(

                    friend => {
                        return (
                            <div className='people' key={friend.id} >
                                <img src={friend.profilepic} />

                                <h3>{friend.first} {friend.last}</h3>
                                <p onClick={() => this.props.dispatch(unfriend(friend.id))}>End this friendship</p>
                            </div>
                        );
                    }
                )}
                <h1>These are your wannabes</h1>

                {this.props.wannabes && this.props.wannabes.map(

                    wannabe => {
                        return (
                            <div className='people' key={wannabe.id} >
                                <img src={wannabe.profilepic} />
                                <h3>{wannabe.first} {wannabe.last}</h3>
                                <p onClick={() => this.props.dispatch(acceptFriendRequest(wannabe.id))}>Start this friendship</p>
                            </div>
                        );
                    }
                )}
            </div>
        );
    }
}




// react integration

function mapStateToProps(state) {
    var list = state.users;
    console.log("list from friends.js", list);
    return {
        friends: list && list.filter(
            user => user.accepted == true
        ),
        wannabes: list && list.filter(
            user => !user.accepted
        )
    };
}


export default connect(mapStateToProps)(Friends);
