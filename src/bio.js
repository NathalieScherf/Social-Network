import React from "react";

import axios from './axios';

export default class Bio extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            editing: false
        };
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.showEditor=this.showEditor.bind(this);

    }
    showEditor(){
        console.log("click on show editor");
        this.setState({
            editing:true
        });
    }
    handleChange(e){

        this.setState({
            [e.target.name ]:  e.target.value
        });
    }
    // 2. check state to see if show text of bio || textarea for editing the bio.

    handleSubmit(e){
        e.preventDefault();
        console.log("von bio handleSubmit", this.state);
        axios.post('/add-bio', this.state).then(resp=>{

            this.setState({bio: resp.data.data[0].bio});
            //the state of uploader
            this.props.setBio(resp.data.data[0].bio);

        });
        this.setState({editing:false});
        //hide the txt area


    }


    render(){
        console.log(this.state.editing, this.props.bio);
        if(this.props.bio&&!this.state.editing){
            return(

                <div className='bio-text'>
                    <p>Bio is present!</p>
                    <p>{this.props.bio}</p>
                    <p onClick={this.showEditor}> Edit your bio</p>
                </div>);
        }
        else if(this.state.editing){
            console.log("editing");
            return(
                <div className='bio-text'>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <textarea name='bio'  onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>);
        }
        else {
            return(
                <div className='bio-text'>
                    <p onClick={this.showEditor}> Edit your bio</p>
                </div>);}
    }
/*

//    <textarea defaultValue={this.state.bio}/>
value={this.state.value}
2. `Bio` - Get passed a function for setting the bio.
   2. state determines if it shows the text of the bio or a textarea for editing the bio
*/

}
