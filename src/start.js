import React from "react";
import ReactDOM from "react-dom";
//import Hello from "./hello";
import Welcome from './welcome';
import Logo from './logo';
let component;
// check url:
if(location.pathname== '/welcome'){
    // render welcome
    component = <Welcome />;
}

//if in /route; render logo component.
else{
    component = <Logo />;
}
// only call ReactDOM once, i.e. here:
ReactDOM.render(component, document.querySelector("main"));

// components are either functions or classes
// for dynamic elements: <div className={'targetInCss' + Date.now()}>Hello, World!</div>
// id="", still works
