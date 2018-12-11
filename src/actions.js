import axios from './axios';


// `receiveFriendsAndWannabes` (no args)

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get('/friendsAndWannabes');
    console.log("actions FandW", data);
    return {
        type: 'RECEIVE_FRIENDS_WANNABES',
        users: data.data
    };
}



//`unfriend` (id of other person)


export async function unfriend(id) {
    const { data } = await axios.post('/deletefriends/'+ id);
    console.log("actions unfriend", data, id);
    return {
        type: 'UNFRIEND',
        id: id
    };
}
//`acceptFriendRequest` (id of other person)

export async function acceptFriendRequest(id) {
    console.log("in accept friend request in actions.js", id);
    const { data } = await axios.post('/acceptfriend/'+ id);
    console.log("actions accept friends", data);
    return {
        type: 'ACCEPT_FRIEND_REQUEST',
        id: id
    };
}

//getOnlineUsers

export async function getOnlineUsers(onliners) {
    //console.log("in get online users in actions.js", onliners);

    return {
        type: 'USERS_ONLINE',
        onlineUsers: onliners
    };
}
//inform about new users:

export async function informAboutNewUser(joiner) {
    console.log("in new users users in actions.js", joiner);

    return {
        type: 'NEW_USER_ONLINE',
        newUser: joiner
    };
}


//remove users who log out
export async function removeOnlineUsers(leaverId) {
    console.log("in leavers in actions.js", leaverId);

    return {
        type: 'USERS_DISCONNECT',
        id: leaverId
    };
}
