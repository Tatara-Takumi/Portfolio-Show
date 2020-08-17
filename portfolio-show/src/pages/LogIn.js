import React,{useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom"
import Container from '@material-ui/core/Container'
import {Link} from 'react-router-dom'
import firebase from 'firebase/app';
import "firebase/firestore";
import { Subscribe } from 'unstated';
import Store from "../Store";
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css';
import CreateUser from  './createUserInfo'
import Helmet from '../components/Helmet'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    textAlign:'center'
  },
  space1:{
    height:100
  },
  space2:{
    height:50
  },
  GoogleLogInButton:{
    padding:"0px"
  },
  GoogleLogIn:{
    width:"200px",
  },
  GitHubIcon:{
    marginRight:"15px"
  },
  Link:{
    color:'#4285f4'
  }
}));

function WrappedLogIn (props) {
  const classes = useStyles();

  
  useEffect(() => {
    window.scrollTo(0,0)
    const naviCreateUserInfo = async(authResult) => {
      var userRef = firebase.firestore().collection('users').doc(authResult.user.uid)
      await userRef.get()
      .then(async function(doc){
        if(doc.exists){
          await props.Store.logInStateSet(true)
          props.navigation.history.push('/profile')
        }else{
          document.getElementById('firebaseui-auth-container').style.display='none'
          document.getElementById('before').style.display='none'
          document.getElementById('create').hidden=false
        }
      }).catch(function(error){
        console.error(error)
      })

    }

    let ui = firebaseui.auth.AuthUI.getInstance()
    if(!ui){
      ui = new firebaseui.auth.AuthUI(firebase.auth())
    }
    const uiConfig={
      callbacks:{
        signInSuccessWithAuthResult:(authResult,redirectUrl) => {
          naviCreateUserInfo(authResult)
        },
        uiShown:()=>{
          document.getElementById('loader').style.display='none'
        },
      },
      signInFlow:'popup',
      signInOptions:[
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID
      ],
      tosUrl:'/terms',
      privacyPolicyUrl: '/privacypolicy',
      
    };
    ui.start('#firebaseui-auth-container', uiConfig)
  },[props.Store,props.navigation.history])

  

  return (
    <React.Fragment>
        <Helmet title={'ログイン|Portfolio Show'} desctription='Portfolio Showは誰でも気軽に投稿できるポートフォリオ投稿サイトです。個人やチームのポートフォリオとしても活用できます！' />
      <CssBaseline />
      <Container id='before' maxWidth='sm' className={classes.root}>
      <div className={classes.space1} />
          <Typography component="h1" variant="h5">
            ログイン/新規登録
          </Typography>
          <div className={classes.space2} />
          GoogleアカウントまたはGitHubアカウントでログイン/新規登録できます。
          <div className={classes.space2} />


          <div>
            <div id="firebaseui-auth-container" />
            <div id="loader">Now Loading...</div>
          </div>

          <div>
            新規登録すると、<Link to='/terms' className={classes.Link}>利用規約</Link>および<Link to='/privacypolicy' className={classes.Link}>プライバシーポリシー</Link>に同意したとみなされます。
          </div>
          
          
      
        </Container>
        <div id='create' hidden >
        <Container maxWidth='sm' className={classes.root}>
          <div className={classes.space2}/>
  
            <Typography component="h1" variant="h5">
              新規登録ありがとうございます。
            </Typography>
            <div>
              ユーザーネームは後から変更可能です。
            </div>
              <CreateUser />
          
        </Container>
        </div>
    </React.Fragment>
  );
}

const LogIn = (props) => (
  <Subscribe to={[Store]}>
      {Store => 
          <WrappedLogIn Store={Store} navigation={props} />
      }
  </Subscribe>
)
export default withRouter(LogIn)