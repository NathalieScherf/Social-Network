

import React from "react";
import {BrowserRouter, Route} from 'react-router-dom';

//url in route should not be the same as the url on the server :
//do this instead:
/* in indexjs:
app.get('user/:id.json', function (req,res){
    db.getUserById(req.params.id).then(data=> res.jason(data))
})*/
class SomeComp extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <div>
                    <Route path='/user/:id'component ={ User }/>
                </div>
            </BrowserRouter>);
    }
}
