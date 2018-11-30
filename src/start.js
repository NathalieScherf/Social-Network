import React from "react";
import ReactDOM from "react-dom";
import Welcome from './welcome';

import App from './app';
let component;
// check url:
// for the not logged in experience:
if(location.pathname== '/welcome'){
    // render welcome
    component = <Welcome />;
}

//if in /route; render loggged in experience component.
else{
    component = <App />;
}
// only call ReactDOM once, i.e. here:
ReactDOM.render(component, document.querySelector("main"));

// components are either functions or classes
// for dynamic elements: <div className={'targetInCss' + Date.now()}>Hello, World!</div>
// id="", still works
