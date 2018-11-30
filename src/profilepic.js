import React from 'react';
//props is data in state of app.js
export default function ProfilePic(props){
    console.log("props;", props);
    return(
        <div>
            <h1>Welcome to profile pic, {props.first} </h1>
            <img onClick={props.showUploader} src={props.profilePicUrl} />

        </div>
    );

}
