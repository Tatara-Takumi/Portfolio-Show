import React from "react";
import {Helmet} from "react-helmet";

function Application(props) {
  
    return (
        <div className="Helmet">
            <Helmet>
                <meta charSet="utf-8" />
                <title>
                    {props.title}
                </title>
                <meta name='description' content={props.description} />
                
            </Helmet>
        </div>
    );
  
};

export default Application