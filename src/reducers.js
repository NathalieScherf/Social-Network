


export default function reducer(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDS_WANNABES') {
        return Object.assign({}, state, {
            users: action.users
        });

    }
    if (action.type == 'UNFRIEND') {
        //hier kommt kein data zurück aber ein id von action
        state = {
            ...state,
            users: state.users && state.users.filter(user => {
                if (user.id == action.id) {
                    return ;
                } else {
                    return {user};
                }
            })
        };

    }
    if (action.type == 'ACCEPT_FRIEND_REQUEST') {

        state = {
            ...state,
            users: state.users && state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: true
                    };
                } else {
                    return user;
                }
            })
        };

    }

    console.log("state from reducer: ", state);
    return state;
}
