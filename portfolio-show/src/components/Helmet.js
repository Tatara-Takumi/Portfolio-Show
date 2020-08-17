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
                <meta property='og:type' content='article' />
                <meta property='og:title' content={props.title} />
                {props.image ? 
                    <meta property='og:image' content={props.image} />
                    :
                    null
                }
                <meta property='og:description' content={props.description} />
                <meta property='og:site_name' content="Portfolio Show" />
                <meta property='og:url' content="https://portfolio-show-aec9c.web.app/" />
                
            </Helmet>
        </div>
    );
  
};

export default Application