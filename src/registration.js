import React from "react";
import axios from './axios';
import {Link} from 'react-router-dom';

export default class Registration extends React.Component{
    constructor(){
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state={};
    }
    handleChange(e){
    //    console.log("name of input: ", e.target.name);
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e){
        e.preventDefault();

        axios.post('/registration', this.state).then(resp=>{
            console.log("resp on the POST /registration", resp.data);
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

                <h1>Please register!</h1>
                {this.state.success===false &&<h2>Something went wrong</h2>}
                <Link className="link" to ='/login'> click here to login!</Link>
                <div  className="form">
                    <form onSubmit={this.handleSubmit}>
                        <input onChange = {this.handleChange} name = 'first' type ='text' placeholder ='first name' />
                        <input onChange = {this.handleChange} name = 'last' type ='text' placeholder ='last name' />
                        <input onChange = {this.handleChange} name = 'email' type ='text' placeholder ='email' />
                        <input onChange = {this.handleChange} name = 'password' type ='password' placeholder ='password' />
                        <button> Register </button>
                    </form>
                </div>

            </div>
        );
    }
}
