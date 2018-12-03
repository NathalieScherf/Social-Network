
import React from "react";
import ProfilePic from './profilepic';
import Bio from '.bio';

export default function Profile(props){
    return(
        <div className='profile'>
            <ProfilePic showUploader ={props.showUploader} profilePicUrl ={props.profilePicUrl} />
            {props.first} {props.last}
            <Bio bio={props.bio} setBio={props.setBio}/>
        </div>
    );
}

// for a text area: <textarea defaultValue={this.state.bio}/>
