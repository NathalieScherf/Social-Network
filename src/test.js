import React from "react";
import axios from './axios';
import {Link} from 'react-router-dom';

export const Login = wrapInAuthForm(LoginForm, '/login');
//  component Login triggers a function with two arguments: Component and url
export const Registration = wrapInAuthForm(RegistrationForm, '/registration');

function wrapInAuthForm(Component, url) {
    //LoginForm or RegistrationForm
    return class AuthForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.url = url;
        }
        handleInput(e) {
            // gather value from changed form field
            this.setState({
                [e.target.name]: e.target.value
            });
        }
        handleSubmit(e) {
            // make POST request to this.url and handle response
            e.preventDefault();
            axios.post(this.url, this.state).then(resp=>{
                console.log("resp on the POST/ this.url", resp.data);
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
        render() {
            return <Component error={this.state.success==false}
                handleInput={e => this.handleInput(e)}
                handleSubmit={ e => this.handleSubmit(e)} />;
        }
    };
}

function LoginForm({ handleInput, handleSubmit, error }) {
    return (
        <div>
            <h1>Please log in!</h1>
            {error&&<h2>Something went wrong</h2>}
            <Link className="link" to ='/'> click here to register!</Link>

            <form onSubmit={handleSubmit}>
                <input onChange = {handleInput} name = 'email' type ='text' placeholder ='email' />
                <input onChange = {handleInput} name = 'password' type ='password' placeholder ='password' />
                <button> Login </button>
            </form>

        </div>
    );
}

function RegistrationForm({ handleInput, handleSubmit, error }) {
    //funktioner som argument för att de är i formuläret
    return (
        <div>
            <h1>Please register!</h1>
            {error &&<h2>Something went wrong</h2>}
            <Link className="link" to ='/login'> click here to login!</Link>
            <form onSubmit={handleSubmit}>
                <input onChange = {handleInput} name = 'first' type ='text' placeholder ='first name' />
                <input onChange = {handleInput} name = 'last' type ='text' placeholder ='last name' />
                <input onChange = {handleInput} name = 'email' type ='text' placeholder ='email' />
                <input onChange = {handleInput} name = 'password' type ='password' placeholder ='password' />
                <button> Register </button>
            </form>
        </div>
    );
}
