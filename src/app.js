import React from 'react';
import axios from './axios';
import Logo from './logo';
import ProfilePic from './profilepic';
import Uploader from './uploader';
import Profile from './profile';
import OtherPersonProfile from './otherpersonprofile';
import {BrowserRouter, Route} from 'react-router-dom';
import Friends from './friends';
import OnlineUsers from './onlineUsers';
import CuteAnimals from './cuteAnimals';
import Chat from './chat';

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
                    <a href="/friends">friends</a>
                    <br/>
                    <a href="/chat">chat</a>
                    <br/>
                    <a href="/">my page</a>
                    <br/>
                    <a href="/onlineUsers">online users</a>
                    <br/>
                    <a href="/logout"> log out </a>
                    <br/>
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        profilePicUrl={this.state.profilePicUrl}
                        showUploader={this.showUploader}
                    />

                </div>
                <div className='main-box'>
                    <h1> Welcome {this.state.first}! </h1>
                    <BrowserRouter>

                        <div>

                            <Route exact path='/' render={()=>{ return < Profile
                                id={this.state.id}
                                profilePicUrl={this.state.profilePicUrl}
                                first={this.state.first}
                                last={this.state.last}
                                bio={this.state.bio}
                                setBio={this.setBio}

                                showUploader={this.showUploader}/>;
                            }}/>
                            <Route path ='/user/:id' render={props=>(
                                <OtherPersonProfile { ...props }
                                    key ={props.match.url}
                                />
                            )}/>
                            <Route path ='/friends' render={()=>{
                                return <Friends />;
                            }}/>
                            <Route path ='/onlineusers' render={()=>{
                                return <OnlineUsers />;
                            }}/>
                            <Route path ='/cuteAnimals' render={()=>{
                                return <CuteAnimals />;
                            }}/>
                            <Route path ='/chat' render={()=>{
                                return <Chat />;
                            }}/>
                        </div>
                    </BrowserRouter>
                    {this.state.uploaderIsVisible && (<Uploader
                        profilePicUrl={this.state.profilePicUrl}
                        changeImg= {this.changeImg}
                        closeComponent={this.closeComponent}/>)}
                </div>

            </div>
        );
    }
}
