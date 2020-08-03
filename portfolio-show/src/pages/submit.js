import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from "react-router-dom"
import { Formik } from 'formik';
import * as Yup from 'yup'
import firebase from 'firebase/app';
import 'firebase/storage'
import { Subscribe } from 'unstated';
import Store from "../Store"
import Helmet from '../components/Helmet'


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


function WrappedSubmit (props) {
  const classes = useStyles();
  const [image,setImage] = useState(null)
  const [submitImage,setSubmitImage] = useState(null)
  const [load,setLoad] = useState(false)
  
  useEffect(() => {
    var temp = []
    if(props.Store.state.UserInfo['0'] == null){
      firebase.auth().onAuthStateChanged(async user => {
        if(user){
          firebase.firestore().collection('users').doc(user.uid).get()
            .then(async function (doc) {
              temp.push({...doc.data(),key:doc.id})
              await props.Store.UserInfoSet(temp[0])
            })
            .catch(function(err){
              console.error(err)
            })
        }
      })
    }
  },[props.Store])


  const handleImg = (e) => {
    if (e.target.files.length > 0){
      let filesize = ((e.target.files[0].size/1024)/1024).toFixed(4)
      if(filesize<=5){
      let image = URL.createObjectURL(e.target.files[0])
      setImage(image)
      setSubmitImage(e.target.files[0])
      }else{
        alert('ファイルサイズが5MBを超えています。')
      }
    }
    
  }

  const onhandleSubmit = async(values) => {
    setLoad(true)
    console.log(props.Store.state.UserInfo)
    if(!submitImage){
      setLoad(false)
      return alert('画像も必須です。')
    }
    const postRef = firebase.firestore().collection('posts').doc()
    const storageRef = firebase.storage().ref().child(postRef.id+`.png`)

    const post = {
      UserName:props.Store.state.UserInfo.UserName,
      uid:props.Store.state.UserInfo.key,
      SiteName:values.SiteName,
      url:values.url,
      description:values.description,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp(),
      thumbnail:"",
      favorites:0
    }

    
    await postRef.set(post)
    await storageRef.put(submitImage)
    setTimeout(naviProfile,1900)
  }
  const naviProfile = () => {
    props.navigation.history.push('/profile')
  }
  return (
    <Container maxWidth='md'>
      <Helmet title={'Portfolio Show'} desctription='Portfolio Showは誰でも気軽に投稿できるポートフォリオ投稿サイトです。個人やチームのポートフォリオとしても活用できます！' />  

      <div style={{height:30}} />
      <div style={{textAlign:'center'}}>
        <Typography>
          あなたの作品をぜひ投稿してください！
        </Typography>
      </div>
    <Formik
    initialValues={{SiteName:'',url:'',description:'',img:null}}
    onSubmit={(values) => onhandleSubmit(values)}
    validationSchema={Yup.object().shape({
      SiteName:Yup.string().min(1).max(30,'サイト名は最大50字です。').required(),
      url:Yup.string().url().required(),
      description:Yup.string().min(10,'10文字以上5000字以下で入力してください。').max(5000,'10文字以上5000字以下で入力してください。').required(),
    })}
  >
   {
     ({handleSubmit, handleChange, handleBlur, values, errors, touched}) => (
       <form className={classes.form} onSubmit={handleSubmit}>
          
          <TextField
            variant="outlined"
            margin="normal"
            required 
            touched='true'
            fullWidth
            name="SiteName"
            label="サイト名(最大30字)"
            value={values.SiteName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.SiteName && errors.SiteName ? <span style={{color:'red'}}>{errors.SiteName}</span> : null}
          
          <TextField 
            variant="outlined"
            margin="normal"
            required
            touched='true'
            fullWidth
            label = 'Url'
            name = 'url'
            value={values.url}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.url && errors.url ? <span style={{color:'red'}}>{errors.url}</span> : null}
          
          <TextField
          variant="outlined"
          margin="normal"
          placeholder="頑張ったところや見てほしいところなど書いてください！"
          required
          touched='true'
          fullWidth
          multiline
          rows='5'
          label='概要(最大5,000字)'
          name='description'
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          />
          {touched.description && errors.description ? <span style={{color:'red'}}>{errors.description}</span> : null}
          <div style={{height:'20px'}} />
          <div>サイトの画像(最大5MB)</div>
          <input
          style={{display:'none'}}
          id='img'
          type='file'
          name='img'
          accept='image/*'
          onChange={(e) => handleImg(e)}
          />
          <label htmlFor='img'>
            <div style={{height:450,width:'100%',border:'solid',textAlign:'center'}}>  
              <img src={image} style={{maxHeight:450,maxWidth:900}} alt='' />
            </div>
          </label>
 
          <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {load?<CircularProgress /> : "投稿" }
        </Button>
       </form>
     )
   } 

  </Formik>
  
  
  </Container>
   
  );
}

const Submit = (props) => (
  <Subscribe to={[Store]}>
    {Store => 
      <WrappedSubmit Store={Store} navigation={props} />
    }
  </Subscribe>
)

export default withRouter(Submit)