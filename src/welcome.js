// a functional component, does only display
// components start with capital letters
// Registration/ runs function from registration:

import React from "react";
import Registration from "./registration";
import Login from './login';
// react router: hashRouter (not logged in) and browserRouter (logged in)
import {HashRouter, Route} from 'react-router-dom';
//if url is /, render welcome component
// if url is /login, render Login component

export default function Welcome(){
    return(
        <div className="welcome-container">

            <h1> Welcome! </h1>
            <HashRouter>
                <div>
                    <Route exact path='/' component={
                        Registration
                    }/>
                    <Route path ='/login' component={ Login } />
                </div>
            </HashRouter>

        </div>
    );
}
