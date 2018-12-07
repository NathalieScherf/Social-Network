import React from "react";
import ReactDOM from "react-dom";

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';
import Welcome from './welcome';

import App from './app';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

let component;
// check url:
// for the not logged in experience:
if(location.pathname== '/welcome'){
    // render welcome
    component = <Welcome />;
}

//if in /route; render loggged in experience component.
else{

    component = <Provider store={store}><App /></Provider>;

    //component = <App />;
}
// only call ReactDOM once, i.e. here:
ReactDOM.render(component, document.querySelector("main"));

// components are either functions or classes
// for dynamic elements: <div className={'targetInCss' + Date.now()}>Hello, World!</div>
// id="", still works
