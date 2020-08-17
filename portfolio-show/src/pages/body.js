import React, { useEffect,useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link,withRouter} from 'react-router-dom'
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import firebase from 'firebase/app'
import { Subscribe } from 'unstated';
import Store from "../Store";
import { IconButton } from '@material-ui/core';
import Helmet from  '../components/Helmet'


const useStyles=makeStyles((theme) => ({
    Header_info:{
        display:'flex',
        alignItems:'center'
    },
    date: {
        fontSize:"0.8rem",
        marginTop:'12px'
    },
    img: {
        maxWidth:'100%',
    },
    body:{
        marginLeft:'2.5rem',
        marginRight:'2.5rem'
    },
    introduction:{
       minHeight:'100px',
       whiteSpace:'pre-wrap',
       wordWrap:'break-word'
    },
    tags:{
        display:'flex',
        
    },
    team:{
        display:'flex',
    },
    submitButton:{
        display:'flex'
    },
    Link:{
        marginLeft:'7px',
        cursor:'pointer',
        color:'black'
    }
}))

function WrappedBody(props) {
    const classes = useStyles();
    const [faved,setFaved] = React.useState(false)
    const [fav,setFav] = useState(0)
    const [postRef,setPostRef] = React.useState("")
    const [date,setDate] = React.useState("")
    useEffect(() => {
        window.scrollTo(0,0)
        const ref = firebase.firestore().collection('posts').doc(props.navigation.match.params.id)
        setPostRef(ref)
        const dataArray=[]
        if(props.Store.state.field.key !== props.navigation.match.params.id ){
            ref.get()
            .then(async function (doc) {
                dataArray.push({...doc.data(),key:doc.id})
                console.log(dataArray)
                let preDate = dataArray['0'].updatedAt.toDate()
                setDate(preDate.getFullYear()+"/"+(preDate.getMonth()+1)+"/"+preDate.getDate())
                await props.Store.fieldSet(dataArray['0'])
                setFav(props.Store.state.field.favorites)
                
                // setLists(dataArray['0'])
                
            })
            .catch(function(err) {
                console.error(err)
            })
            }else{
                let preDate_ = props.Store.state.field.updatedAt.toDate()
                setDate(preDate_.getFullYear()+"/"+(preDate_.getMonth()+1)+"/"+preDate_.getDate())
                setFav(props.Store.state.field.favorites)
            } 
        
            
        
    },[props.Store,props.navigation.match.params.id])

    const addFavorite = async() => {
        
        if(props.Store.state.logInState && props.Store.state.uid){
            
            setFaved(true)
            setFav(fav+1)

            const favoritesRef = await firebase.firestore().collection('users').doc(props.Store.state.uid).collection('favorites').doc(props.navigation.match.params.id).get()
            if(favoritesRef.exists){
                postRef.update({
                    favorites:firebase.firestore.FieldValue.increment(1)
                })
            }else{
                var batch = firebase.firestore().batch()
                batch.set(favoritesRef.ref,{
                    postRef:postRef,
                    createdAt:firebase.firestore.FieldValue.serverTimestamp()
                })
                batch.update(postRef,{
                    favorites:firebase.firestore.FieldValue.increment(1)
                })
                batch.commit()
                }

            
        }else{
            alert('ログインが必要です！')
        }

    }    
    
    return (
        <React.Fragment>
            <Helmet 
                title={props.Store.state.field.SiteName +' By ' + props.Store.state.field.UserName + '|Portfolio Show' } 
                description={props.Store.state.field.description} 
                image={props.Store.state.field.thumbnail}
                />
        <CssBaseline />
        <Container className={classes.cardGrid} maxWidth="lg">
        <div style={{height:'1rem'}} />

        <div style={{fontSize:'1.5rem',display:'flex'}}>
            By<Link to={`/oprofile/${props.Store.state.field.uid}`} className={classes.Link} style={{cursor:'pointer'}} >{props.Store.state.field.UserName}</Link>
            <div style={{width:'1rem'}} />
            <div className={classes.date}>最終更新:{date}</div>
        </div>

        <h1>
            {props.Store.state.field.SiteName}
        </h1>
        <div className={classes.Header_info}>
            <IconButton onClick={addFavorite}> 
                {faved ? <StarIcon style={{fill:'black'}} /> : <StarBorderIcon style={{color:'black'}} />} 
                  
            </IconButton>
            <div>
                {fav}
            </div>
            <div style={{width:"20px"}} />
            <div>
                URL:<a href={props.Store.state.field.url}>{props.Store.state.field.url}</a>
            </div>
        </div>

        <div style={{height:'30px'}} />
            <div style={{textAlign:'center'}}>
                <img alt='サムネイル' className={classes.img} src={props.Store.state.field.thumbnail} />
            </div>

        <div style={{height:"20px"}} />

        <div className={classes.body}>  
          <div className={classes.introduction}>
            {props.Store.state.field.description}
          </div>

          {/* <div className={classes.tags}>
            <div style={{width:'150px'}}>
                Tags
            </div>
            <div>
                Blog,Css
            </div>
          </div> */}
          
          

          {/* <div className={classes.team}>
            <div style={{width:'150px'}}>
            Team
            </div>

            <div>
            Antorace
            </div>
          </div> */}

          <div style={{height:'30px'}} />
         
          {/* <div className={classes.submitButton}>
            <div style={{display:'flex'}}>
            <TwitterIcon />
            <div style={{width:'30px'}} />
            <GitHubIcon />

            </div>
          </div> */}
        </div>
        </Container>
        <div style={{height:'50px'}} />
        </React.Fragment>
    )
}

const Body = (props) => (
    <Subscribe to={[Store]}>
      {Store =>
        <WrappedBody Store={Store} navigation={props} />
      }
    </Subscribe>
  )
  
export default withRouter(Body)