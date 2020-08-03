import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom"
import { Formik } from 'formik';
import * as Yup from 'yup'
import firebase from 'firebase/app';
import "firebase/firestore";
import { Subscribe } from 'unstated';
import Store from "../Store"


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  
}));


function WrappedCreateUserInfo (props) {
  const classes = useStyles();
  
 


  
  

  const onhandleSubmit = async(values) => {
    var uid = ""
    if(props.Store.state.uid.length < 1){
        firebase.auth().onAuthStateChanged(async user=>{
            if(user){
                uid = user.uid
                props.Store.state.uidSet(uid)
            }
        })
    }
    
    const user={
      UserName:values.UserName,
      description:"",
      twitter:"",
      GitHub:"",
      MyPage:"",
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    }

    var temp = props.Store.state.UserInfo
    temp['UserName'] = values.UserName
    temp['description'] = ""
    temp['twitter'] = ""
    temp['GitHub'] = ""
    temp['MyPage'] = ""
    await props.Store.UserInfoSet(temp)
    await firebase.firestore().collection('users').doc(props.Store.state.uid).set(user)  
    await props.Store.logInStateSet(true)
    props.navigation.history.push('/profile')
  }

  return (
    <Container maxWidth='md'>
      <div style={{height:30}} />
      <Formik
          initialValues={{UserName:""}}
          onSubmit={(values) => onhandleSubmit(values)}
          validationSchema={Yup.object().shape({
            UserName:Yup.string().min(1).max(30,'ユーザーネームは30文字以内です。').required(),
          })}
        >
          {
            ({handleSubmit, handleChange, handleBlur, values, errors, touched}) => (
              
              <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                required
                margin='dense'
                id='UserName'
                name='UserName'
                label='UserName'
                value={values.UserName}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                />
                
                
                <Button type='submit' color="primary">
                  ユーザー登録完了
                </Button>
              </form>
              
            )
          }
          </Formik>
  
  </Container>
   
  );
}

const CreateUserInfo = (props) => (
  <Subscribe to={[Store]}>
    {Store => 
      <WrappedCreateUserInfo Store={Store} navigation={props} />
    }
  </Subscribe>
)

export default withRouter(CreateUserInfo)