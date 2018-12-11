import * as io from 'socket.io-client';
import {getOnlineUsers, removeOnlineUsers,informAboutNewUser} from './actions';


let socket;
//cerate a new socket, but only if there is not one already
export function initSocket(store){
    if (!socket){
        socket= io.connect();
        //listen for event:
    

        socket.on('onlineUsers', listOfOnlineUsers=>{
            console.log('listOfOnlineUsers', listOfOnlineUsers);
            store.dispatch( getOnlineUsers(listOfOnlineUsers) );
        });
        socket.on('userJoined', userWhoJoined=>{
            store.dispatch(informAboutNewUser(userWhoJoined));
        });
        socket.on('userLeft', userWhoLeft=>{
            store.dispatch(removeOnlineUsers(userWhoLeft));
        });
        //most of our client side socket code will go here:
        //listen for stuff from the server: on('name of message from server', function )
        //function will run when client hears the event, takes data from socket.emit as agrument
        socket.on('catnip', message=>{
            //console.log("message in catnip event: ", message);

        });
    }
    return socket;
}



// next steps:
/*
for online users: put array of onlineUsers in Redux,
dispatch, actions, reducers
the onlien users component should render the list from Redux
need to relaod page to see new users

for users joined:
-skriv db funtion  getUserById in index.js and send info to every other user EXCEPT connected user
add to redux,
- before user joined event: make sure the id is unique (exclude any reloading tha causes adding to the arry of online users )

for userLeft:
listen for a disconnect.
*/
