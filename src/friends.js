import React from 'react';
//import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
//change to my functions from actions.js
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


/*


 return (
            <div id="hot-or-not">
                <div className="user">
                    <img src={users[0].image} />
                    <div className="buttons">

                        <button onClick = { () => this.props.dispatch(makeHot(users[0].id)) } >Hot</button>

                        <button>Not</button>
                    </div>
                </div>
                <nav>
                    <Link to="/hot">See who&apos;s hot</Link>
                    <Link to="/not">See who&apos;s not</Link>
                </nav>
            </div>
        );
    }
}*/

// react integration

function mapStateToProps(state) {
    var list = state.users;
    console.log("list from friends.js", list);
    return {
        friends: list && list.data.filter(
            user => user.accepted == true
        ),
        wannabes: list && list.data.filter(
            user => !user.accepted
        )
    };
}

/*
const mapStateToProps = function(state) {
    return {
        users: state.users && state.users.filter(user => user.hot == null)
    };
};*/
export default connect(mapStateToProps)(Friends);
