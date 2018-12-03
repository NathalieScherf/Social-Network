import React from 'react';
import axios from './axios';
import Logo from './logo';
import ProfilePic from './profilepic';
import Uploader from './uploader';
import Profile from './profile';

import {BrowserRouter, Route} from 'react-router-dom';
export default class App extends React.Component{
    constructor(){
        super();
        this.state={
            uploaderIsVisible: false
        };
        this.showUploader=this.showUploader.bind(this);
        this.changeImg= this.changeImg.bind(this);
        this.closeComponent=this.closeComponent.bind(this);
        this.setBio=this.setBio.bind(this);
    }
    // to show uploader:
    showUploader(){
        this.setState({
            uploaderIsVisible:true
        }, ()=> console.log("state in showUploader", this.state.profilePicUrl));
    }
    changeImg(profilePicUrl) {
        this.setState({
            profilePicUrl: profilePicUrl,
            uploaderIsVisible: false
        });
    }
    closeComponent(){
        console.log("clicked");
        this.setState({
            uploaderIsVisible: false
        });

    }
    setBio(bio){
        console.log("bio!");
        this.setState({
            bio: bio
        });
    }
    //#2 mount: good place for axios requests to get info about the user:
    componentDidMount(){

        axios.get('/user').then(resp=>{

            this.setState(resp.data);
            console.log("from get user in app", resp.data);
        });
    }
    /* async componentDidMount(){
    const {data}= await axios.get('/user');
            this.setState(resp.data);
    }*/
    // #1 render
    render(){
        return(
            <div className='page'>
                <div className='profile-header-container'>
                    <Logo/>
                    <ProfilePic
                        first={this.state.first}
                        profilePicUrl={this.state.profilePicUrl}
                        showUploader={this.showUploader}
                    />
                </div>
                <div className='main-box'>
                    <h1> Welcome {this.state.first}! </h1>
                    <BrowserRouter>

                        <Route path='/' render={()=>{ return < Profile
                            id={this.state.id}
                            profilePicUrl={this.state.profilePicUrl}
                            first={this.state.first}
                            last={this.state.last}
                            bio={this.state.bio}
                            setBio={this.setBio}
                            showUploader={this.showUploader}/>;
                        }}/>

                    </BrowserRouter>
                    {this.state.uploaderIsVisible && (<Uploader
                        changeImg= {this.changeImg}
                        closeComponent={this.closeComponent}/>)}
                </div>

            </div>
        );
    }
}

//in browserRouter path= '/' to get the profile to load on first page
// user/id is for tomorrow to laos individual pages
