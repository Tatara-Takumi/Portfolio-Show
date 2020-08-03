import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader'
import '../styles/ClipLoader.css'


function Loader(props) {

  return (
    <div className={"ClipLoader"}>
      
        <ClipLoader
            size={100}
            color='black'
            loading={props.loading}
        />
      
    </div>
  );
}

export default Loader