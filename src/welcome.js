// a functional component, does only display
// components start with capital letters
// Registration/ runs function from registration:

import React from "react";
import Registration from "./registration";
export default function Welcome(){
    return(
        <div className="welcome-container">
            <h1> Welcome! </h1>

            <Registration/>

        </div>
    );
}
