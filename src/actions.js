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
