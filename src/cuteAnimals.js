import React from 'react';
import{ connect } from 'react-redux';

class CuteAnimals extends React.Component{
    constructor(){
        super();
    }

    render(){
        console.log(this.props.animals);
        // dont do anything before animals i is global state
        if(!this.props.animals){
            return null;
        }
        let arrOfCuteAnimals=this.props.animals.map((elem, idx) =>{
            return(
                <div key= {idx}>
                    <p>
                        {elem.animal}, {elem.cutenes}</p>
                </div>
            );

        });
        return(
            <div>

                <h1>Cute animals</h1>
                {arrOfCuteAnimals}
            </div>
        );
    }
}

function mapStateToProps(state) {

    return {
        animals: state.catnipsCuteAnimals,

    };
}


export default connect(mapStateToProps)(CuteAnimals);
