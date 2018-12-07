import axios from 'axios';

/* Three action creators
    All three make ajax requests and after the request is successful
    return an action with the appropriate type and the relevant data*/


// `receiveFriendsAndWannabes` (no args)

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get('/friendsAndWannabes');
    console.log("actions FandW", data);
    return {
        type: 'RECEIVE_FRIENDS_WANNABES',
        users: data
    };
}



//`unfriend` (id of other person)


export async function unfriend(idOther) {
    const { data } = await axios.post('/deletefriends/'+ idOther);
    console.log("actions unfriend", data);
    return {
        type: 'UNFRIEND',
        users: data
    };
}
//`acceptFriendRequest` (id of other person)

export async function acceptFriendRequest(idOther) {
    const { data } = await axios.post('/acceptfriend/'+ idOther);
    console.log("actions accept friends", data);
    return {
        type: 'ACCEPT_FRIEND_REQUEST',
        users: data
    };
}
