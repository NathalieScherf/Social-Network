import React from 'react';
import axios from './axios';
import Logo from './logo';
import ProfilePic from './profilepic';
import Uploader from './uploader';
export default class App extends React.Component{
    constructor(){
        super();
        this.state={
            uploaderIsVisible: false
        };
        this.showUploader=this.showUploader.bind(this);
    }
    // to show uploader:
    showUploader(){
        this.setState({
            uploaderIsVisible:true
            // go to app and change some things:
            // var something ="profilePicUrl", uploaderIsVisible
        }, ()=> console.log("state in showUploader", this.state));
    }
    //#2 mount: good place for axios requests to get info about the user:
    componentDidMount(){

        axios.get('/user').then(resp=>{
            console.log("resp from /get user: ", resp);
            this.setState(resp.data);
            console.log("state from get user in app.js", this.state);
        });
    }
    /* async componentDidMount(){
    const {data}= await axios.get('/user');
            this.setState(resp.data);
    }*/
    // #1 render
    render(){
        return(
            <div>
                <Logo/>
                <ProfilePic
                    first={this.state.first}
                    profilePicUrl={this.state.profilePicUrl}
                    showUploader={this.showUploader}
                />
                {this.state.uploaderIsVisible && <Uploader />}
                <h1> Welcome ! </h1>
            </div>
        );
    }
}
