


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
    if(action.type=='USERS_ONLINE'){
        console.log(action);
        return Object.assign({}, state, {
            onlineUsers: action.onlineUsers
        });
    }

    if(action.type=='NEW_USER_ONLINE'){
        console.log("new user online", action);
        state = {
            ...state,
            onlineUsers:  [...state.onlineUsers, action.newUser[0]]
        };
    }
    if(action.type=='USERS_DISCONNECT'){
        console.log("action from reducer disconnect", action.id);
        //filter onlineusers, remove user id: of leaver
        state = {
            ...state,
            onlineUsers: state.onlineUsers && state.onlineUsers.filter(onlineUser => {
                if (onlineUser.id == action.id) {
                    return ;
                } else {
                    return {onlineUser};
                }
            })
        };


    }
    if(action.type=='LIST_OLD_CHAT_MESSAGES'){
        console.log("action from reducer list old messages", action.messages);
        state = {
            ...state,
            chatMessages:  action.messages
        };
    }
    if(action.type=='LIST_CHAT_MESSAGES'){
        console.log("action from reducer list messages", action.newMessages[0]);
        state = {
            ...state,
            chatMessages:  [...state.chatMessages, action.newMessages[0]]

        };
    }
    console.log("state from reducer: ", state);
    return state;
}
