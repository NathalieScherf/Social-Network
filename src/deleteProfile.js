import React from "react";
import axios from './axios';

export default class DeleteProfile extends React.Component{

    constructor(){
        super();

        this.deleteProfile=this.deleteProfile.bind(this);

    }
    componentDidMount(){
        console.log("user id from button deleteProfile", this);
    }

    deleteProfile(){
        console.log("delete this profile", this.props.id);

        //check if I have an old image
        if( this.props.profilePicUrl !== null){
            console.log("gibt schon bild", this.props.profilePicUrl);
            // remove amazon prefix from image url
            var oldImageAmazon= this.props.profilePicUrl;
            var amazonPrefix = oldImageAmazon.lastIndexOf('/');
            var oldImage= oldImageAmazon.slice(amazonPrefix+1);
            console.log(oldImage);
            axios.post('/deleteImg', {oldImage});
        }
        axios.post('/deleteProfile/'+ this.props.id).then(resp=>{
            console.log("from delete fs", resp);
            if (resp.data.userDeleted === true){
                console.log("user deleted in frontend");
                location.replace('/welcome');
            }
        });
    }

    render(){
        return(
            <div className="delete-button">

                <button onClick={this.deleteProfile} name='deleteProfile' className='link' > Delete my account  </button>

            </div>
        );
    }
}
