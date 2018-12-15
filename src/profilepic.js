import React from 'react';
//props is data in state of app.js
export default function ProfilePic(props){
    if(props.profilePicUrl){
        return(
            <div className='profilepic-container'>
                <h1>{props.first} {props.last}</h1>
                <img className='smallimg' onClick={props.showUploader} src={props.profilePicUrl} />

            </div>
        );}
    else{
        return(
            <div className='profilepic-container'>
                <h1>{props.first} {props.last}</h1>
                <img className='smallimg' onClick={props.showUploader} src={"/profile_default.png"} />

            </div>
        );
    }

}
