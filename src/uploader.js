import React from 'react';
import axios from './axios';
export default class Uploader extends React.Component{
    constructor(){
        super();
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);

    }
    handleChange(e){
        console.log("handleChange is running", e.target.files[0]);
        this.setState({
            [e.target.name ]: e.target.files[0]
        });
    }
    handleSubmit(e){
        e.preventDefault();




        // use fromData to upload file to server:
        var formData = new FormData();
        formData.append("file", this.state.file);

        axios.post('/upload', formData).then(resp=>{
            //delete image from amazon
        
            if(resp.data.success){

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
                this.props.changeImg(resp.data.data[0].profilepic);
            }
            //the state of uploader


        });


    }


    render(){
        return(
            <div className='uploader'>
                <h2>Change your profile pic:</h2>
                <div className='closer'><h1 onClick={this.props.closeComponent}>X</h1></div>
                <form onSubmit={this.handleSubmit}>
                    <input name='file' onChange ={this.handleChange} type ='file' accept ='image/*'/>
                    <button>upload </button>
                </form>
            </div>
        );
    }
}
