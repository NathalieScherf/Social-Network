

//if(action.type=='ACCEPT_FRIEND_REQUEST'){
// create a new state object with same props as old
// one object has a change in accepted from true to false
//}

export default function reducer(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDS_WANNABES') {
        return Object.assign({}, state, {
            users: action.users
        });

    }
    if (action.type == 'UNFRIEND') {
        //hier kommt kein data zurück
        return Object.assign({}, state, {
            users: action.users
        });

    }
    if (action.type == 'ACCEPT_FRIEND_REQUEST') {
        /*state = {
         ...state.user, accepted: true*/
        return Object.assign({}, state, {
            users: action.users
        });

    }

    console.log("state from reducer: ", state);
    return state;
}

/*    if (action.type == "MAKE_HOT") {

        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.hotId) {
                    return {
                        ...user,
                        hot: true
                    };
                } else {
                    return user;
                }
            })
        };

    }
*/
