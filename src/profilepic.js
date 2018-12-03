import React from 'react';
//props is data in state of app.js
export default function ProfilePic(props){

    return(
        <div className='profilepic-container'>
            <h1>{props.first} </h1>
            <img className='smallimg' onClick={props.showUploader} src={props.profilePicUrl} />

        </div>
    );

}
