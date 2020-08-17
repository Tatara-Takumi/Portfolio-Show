import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from 'firebase/app'
import 'firebase/storage'
import { Formik } from 'formik';
import * as Yup from 'yup'
import { Subscribe } from 'unstated';
import Store from "../Store";
import { withRouter } from 'react-router-dom';
import  TextField  from '@material-ui/core/TextField';
import Helmet from '../components/Helmet'


const useStyles=makeStyles((theme) => ({
    Header_info:{
        display:'flex'
    },
    date: {
        fontSize:"0.8rem",
        marginTop:'12px'
    },
    img: {
        maxWidth:'100%',
        // height:'850px',
    },
    body:{
        marginLeft:'2.5rem',
        marginRight:'2.5rem'
    },
    introduction:{
       minHeight:'100px'
    },
    tags:{
        display:'flex',
        
    },
    team:{
        display:'flex',
    },
    submitButton:{
        display:'flex'
    }
}))

function WrappedEdit(props) {
    const classes = useStyles();
    const [load,setLoad] = useState(false)
    const [date,setDate] = React.useState("")
    const [image,setImage] = useState(null)
    const [submitImage,setSubmitImage] = useState(null)
    useEffect(() => {
        var temp=[]
        window.scrollTo(0,0)
        if(props.Store.state.field.length !== 0){
            var preDate = props.Store.state.field.updatedAt.toDate()
            setDate(preDate.getFullYear()+"/"+(preDate.getMonth()+1)+"/"+preDate.getDate())
        }else{
            console.log(props.navigation.match.params.id)
            const ref = firebase.firestore().collection('posts').doc(props.navigation.match.params.id)
            
            ref.get()
            .then(async function(doc){
                temp.push({...doc.data(),key:doc.id})
                var preDate = temp['0'].updatedAt.toDate()
                await props.Store.fieldSet(temp['0'])
                setDate(preDate.getFullYear()+"/"+(preDate.getMonth()+1)+"/"+preDate.getDate())
            })
        }
        
    },[props.Store,props.navigation.match.params.id])

    const handleImg = (e) => {
        console.log(e)
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
        console.log(values)
        var key = props.Store.state.field.key
        const postRef = firebase.firestore().collection('posts').doc(key)
        
        const post={
            SiteName:values.SiteName,
            url:values.url,
            description:values.description,
            updatedAt:firebase.firestore.FieldValue.serverTimestamp(),
        }
        if(submitImage){
            const storageRef = firebase.storage().ref().child(postRef.id+`.png`)
            storageRef.put(submitImage)
        }
        await postRef.update(post)
        await props.Store.fieldSet([])
        
        setTimeout(function(){props.navigation.history.push(`/body/${key}`)},1900)
        
    }
  
    
        
    return (
        <React.Fragment>
            <Helmet title={'投稿の編集|Portfolio Show'} desctription='Portfolio Showは誰でも気軽に投稿できるポートフォリオ投稿サイトです。個人やチームのポートフォリオとしても活用できます！' />  
        <CssBaseline />
        <Container className={classes.cardGrid} maxWidth="lg">
        <div style={{height:'1rem'}} />
        
        <div style={{fontSize:'1.5rem',display:'flex'}}>
            
            <div className={classes.date}>最終更新:{date}</div>
        </div>
        
        <div style={{height:50}} />

        <Formik
        initialValues={{SiteName:props.Store.state.field.SiteName,url:props.Store.state.field.url,description:props.Store.state.field.description}}
        onSubmit={(values) => onhandleSubmit(values)}
        validationSchema={Yup.object().shape({
            SiteName:Yup.string().min(1).max(30,'サイト名は最大30字です。'),
            url:Yup.string().url(),
            description:Yup.string().min(10,'10文字以上5000字以下で入力してください。').max(5000,'10文字以上5000字以下で入力してください。').required()
        })}
        >
            {
            ({handleSubmit,handleChange,values,errors,touched}) => (
                <form onSubmit={handleSubmit}>
                <h1 style={{marginTop:'0px'}}>
                    <TextField 
                    label='SiteName'
                    id='SiteName'
                    value={values.SiteName} 
                    variant='outlined' 
                    style={{width:'50%'}} 
                    onChange={handleChange}
                    />
                    {errors.SiteName ? <span style={{color:'red'}} > {errors.SiteName} </span> : null}
                </h1>

                <TextField
                 label='URL'
                 id='url'
                 variant='outlined'
                 style={{width:'50%'}}
                 value={values.url} 
                 onChange={handleChange} 
                  />
                {errors.url ? <span style={{color:'red'}}> {errors.url} </span> : null}
                <div style={{height:'30px'}} />

                <div style={{textAlign:'center',outline:'solid',width:"100%"}}>
                    <input
                    style={{display:'none'}}
                    id='img'
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleImg(e)}
                    />
                    <label htmlFor='img'>
                        <img alt='サムネイル' className={classes.img} src={image ? image : props.Store.state.field.thumbnail} />
                    </label> 
                </div>

                <div style={{height:"20px"}} />

                <div className={classes.body}>  
                    <div className={classes.introduction}>
                        <TextField
                        label='概要(最大5,000字)'
                        id='description'
                        fullWidth
                        variant='outlined'
                        value={values.description} 
                        onChange={handleChange}
                        multiline
                        rows="5"
                        />
                        {errors.description ? <span style={{color:'red'}}>{errors.description} </span> : null}
                    </div>

                
                    <div style={{height:'30px'}} />
                    <div style={{textAlign:'center'}}>
                        <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        >
                        {load ?<CircularProgress /> : '更新'}
                        </Button>
                    </div>
                </div>

                </form>
            )
        }
        </Formik>  
            
        </Container>
        <div style={{height:'50px'}} />

        
        </React.Fragment>
    )
}

const Edit = (props) => (
    <Subscribe to={[Store]}>
      {Store =>
        <WrappedEdit Store={Store} navigation={props} />
      }
    </Subscribe>
  )
  
export default withRouter(Edit)