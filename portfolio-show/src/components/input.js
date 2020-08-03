import React from "react";
import { connect } from "formik";

function handleImg (props){
    props.handleChange()
    converImg
}



const Input = ({ name, formik: { errors } }) => {
  return (
    <div>
      <input name={name} type='file'
        accept='image/*' onChange={e => handleImg(e)} 
    />
    </div>
  );
};


export default connect(Input);