import React from 'react';

import {Link} from 'react-router-dom';
import axios from './axios';
export default class Login extends React.Component{
    constructor(){
        super();

        this.handleChange = this.handleChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.state={};
    }

    handleChange(e){
    //    console.log("name of input: ", e.target.name);
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleLoginSubmit(e){
        e.preventDefault();
        console.log("from handleLoginSubmit:",this.state);
        axios.post('/login', this.state).then(resp=>{
            console.log("resp on the POST /login", resp.data);
            console.log(this.state);
            // if everything goes well: redirect to /
            if(resp.data.success==true){
                location.replace('/');}
            // if error: i.e. missing info: render an error message to fill in all fields
            else {

                this.setState({success:false});
                console.log("false data: ",this.state);}
        });
    }
    render(){
        return(
            <div className="registration-container">
                <h1>Please log in!</h1>
                {this.state.success===false &&<h2>Something went wrong</h2>}
                <Link className="link" to ='/'> click here to register!</Link>
                <div  className="form">
                    <form onSubmit={this.handleLoginSubmit}>
                        <input onChange = {this.handleChange} name = 'email' type ='text' placeholder ='email' />
                        <input onChange = {this.handleChange} name = 'password' type ='password' placeholder ='password' />
                        <button> Login </button>
                    </form>
                </div>
            </div>
        );
    }
}
