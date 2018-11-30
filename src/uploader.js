import React from 'react';
import axios from './axios';
export default class Uploader extends React.Component{
    constructor(){
        super();
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleChange(e){
    //    console.log("handleChange is running", e.target.files[0]);
        this.setState({
            [e.target.name ]: e.target.files[0]
        });
    }
    handleSubmit(e){
        e.preventDefault();
        console.log("handel submit runnig");
        // form data stuff for the files
        // use fromData to upload file to server:
        var formData = new FormData();
        formData.append("file", this.state.file);

        console.log("form data from handle submit", formData);
        axios.post('/upload', formData).then(resp=>{
            console.log("resp from /upload : ", resp);
            this.setState(resp.data);
            console.log("state from upload image", this.state);
        });
        // make post /upload request to server
        // on server: same as image board
        // then of axios.post('/upload') will run.
        // go to app and change some things:
        // var something ="profilePicUrl", uploaderIsVisible

    }
    render(){
        return(
            <div>
                <h1> upload an image</h1>
                <form onSubmit={this.handleSubmit}>
                    <input name='file' onChange ={this.handleChange} type ='file' accept ='image/*'/>
                    <button>upload </button>
                </form>
            </div>
        );
    }
}
