import React,{Component} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Link, withRouter} from 'react-router-dom';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import CreateIcon from '@material-ui/icons/Create';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik } from 'formik';
import * as Yup from 'yup'
import firebase from 'firebase/app'
import '../styles/profile.css'
import { Subscribe } from 'unstated';
import Store from "../Store";
import { InputAdornment } from '@material-ui/core';
import Cliploader from '../components/Loader'
import CardActionArea from '@material-ui/core/CardActionArea'
import Helmet from '../components/Helmet'



class WrappedProfile extends Component {
  constructor(props){
    super(props);
    this.state={
      open:false,
      open2:false,
      user:[],
      myPosts:[],
      favorites:[],
      loading:true,
      template:"ここにプロフィール文が表示されます。",
    }
  }
  
  
  async componentDidMount(){
    let temp = []
    let usertemp = []
    let favoritestemp=[]
    
      firebase.auth().onAuthStateChanged(async user => {
        window.scrollTo(0,0)
        if(user){
          let userid = user.uid
          const ref = firebase.firestore().collection('users').doc(userid)
          this.props.Store.uidSet(userid)
          await firebase.firestore().collection('users').doc(userid).get()
            .then(function(doc){
              usertemp.push({...doc.data(),key:doc.id})
            })
          this.setState({user:usertemp['0']})
          this.props.Store.UserInfoSet(usertemp['0'])

          await ref.collection('favorites').get()
            .then(function(qs){
              qs.forEach(async function(doc){
                const favoritestemp_ = await doc.get('postRef').get()
                favoritestemp.push({
                  key:doc.id,
                  UserName:favoritestemp_.get('UserName'),
                  uid:favoritestemp_.get('uid'),
                  SiteName:favoritestemp_.get('SiteName'),
                  url:favoritestemp_.get('url'),
                  description:favoritestemp_.get('description'),
                  createdAt:favoritestemp_.get('createdAt'),
                  updatedAt:favoritestemp_.get('updatedAt'),
                  thumbnail:favoritestemp_.get('thumbnail')
                })
              })
            })
            .catch(function(err){
              console.error(err)
            })
            this.setState({favorites:favoritestemp})

          await firebase.firestore().collection('posts').where('uid','==',userid).get()
            .then(function(qs) {
              qs.forEach(function(doc) {
                temp.push({...doc.data(),key:doc.id})
              })
            })
            .catch(function(err) {
              console.error(err)
            })
            this.setState({myPosts:temp})
        }
      })
      
    

    this.setState({loading:false})
  }



  naviEdit = async(value,index) => {
    await this.props.Store.fieldSet(value)
    this.props.navigation.history.push(`/edit/${value.key}`)
  }

  

  handleClickOpen = () => {
    this.setState({open:true})
  };

  handleClose = () => {
    this.setState({open:false})
  };


  onhandleSubmit = async(values) => {
    const user={
      UserName:values.UserName,
      description:values.description,
      twitter:values.twitter,
      GitHub:values.GitHub,
      MyPage:values.MyPage,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    }

    var temp = this.state.user
    temp['UserName'] = values.UserName
    temp['description'] = values.description
    temp['twitter'] = values.twitter
    temp['GitHub'] = values.GitHub
    temp['MyPage'] = values.MyPage
    await this.props.Store.UserInfoSet(temp)
     
    await firebase.firestore().collection('users').doc(this.state.user.key).update(user)
    this.setState({open:false})
  }
  naviBody = async(value) => {
    await this.props.Store.fieldSet(value)
    this.props.navigation.history.push(`/body/${value.key}`)

  }

  deleteFavorites = (key,index) => {
    var temp = []
    temp = this.state.favorites
    delete temp[index]
    this.setState({favorites:temp})
    firebase.firestore().collection('users').doc(this.props.Store.state.uid).collection('favorites').doc(key).delete()
  }

  deleteMyPosts = async(key,index) => {
    //postの消去
    var temp = []
    temp = this.state.myPosts
    delete temp[index]
    this.setState({myPosts:temp})
    firebase.firestore().collection('posts').doc(key).delete()
    //画像の消去はcloudFunctionで
  }

  deleteUser = async()=>{
    //userに関するドキュメントの消去
    //userアカウントそのものの消去はCloudFunctionsで
    var userRef = firebase.firestore().collection('users').doc(this.state.user.key)
    var postRef = firebase.firestore().collection('posts').where('uid','==',this.state.user.key)
    
    var batch = firebase.firestore().batch()
    
    batch.delete(userRef)
    await postRef.get().then(function(qs){
      qs.forEach(async function(doc){
        batch.delete(doc.ref)  
      })
      return batch.commit()
    })
    .catch(function(err){
      console.log(err)
      alert('処理に失敗しました。もう一度やり直してください。')
    })

    firebase.auth().signOut().then(async function(){
      await this.props.logInStateSet(false)
    }).catch(function(err){
      console.log(err)
    })
    
  }

  render(){
    const {UserName={}} = this.state.user
    const {description={}} = this.state.user
    const {twitter={}} = this.state.user
    const {GitHub={}} = this.state.user
    const {MyPage={}} = this.state.user

  return (
    <React.Fragment>
      
      
      <Helmet title={'Portfolio Show'} desctription='Portfolio Showは誰でも気軽に投稿できるポートフォリオ投稿サイトです。個人やチームのポートフォリオとしても活用できます！' />  
        {/* Hero unit */}
        <Container maxWidth="md">
        
        <div style={{height:10}} /> 
        
        <div className={"profile_heroContent"}>
        
                <div className={"profile_userContent"}>
                  
                <Typography component="h2" variant="h2" align="center" color="textPrimary" gutterBottom>
                  {this.state.user.UserName}
                </Typography>
                <Typography variant="h6" color="textSecondary" paragraph>
                
                  {this.state.user.description === '' ? 
                  this.state.template
                  :
                  this.state.user.description}
                </Typography>
                </div>
            <div className={'profile_heroButton'}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  {this.state.user.twitter ? 
                  <a href={'https://twitter.com/'+this.state.user.twitter} target="_blank" rel="noopener noreferrer" title='Twitterアカウント' >
                    <TwitterIcon />
                  </a>
                  :
                  null
                }
                
                </Grid>
                <Grid item>
                  {this.state.user.GitHub ? 
                  <a href={'https://github.com/'+this.state.user.GitHub} target="_blank" rel="noopener noreferrer" title='GitHubアカウント' >
                    <GitHubIcon  />
                  </a>
                  :
                  null
                }
                  
                </Grid>
                <Grid item>
                  {this.state.user.MyPage ? 
                  <a href={'https://'+this.state.user.MyPage} target="_blank" rel="noopener noreferrer" title='ホームページやブログ等' >
                  <WebAssetIcon />
                  </a> 
                  : 
                  null}  
                  
                </Grid>
              </Grid>
            </div>

        </div>
        <div className={"profile_belowIcons"}>
          <Button onClick={() => this.handleClickOpen()}>
            <CreateIcon /> 
            <div>プロフィールを編集</div>
          </Button>
        </div>
        <div>
           
        </div>
        
        </Container>
        {/* 編集ダイアログ */}
        <Dialog className={"profile_Dialog"} open={this.state.open} onClose={()=>this.handleClose()} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">プロフィールの編集</DialogTitle>
        
          <Formik
          enableReinitialize={true}
          initialValues={{UserName:UserName,description:description,twitter:twitter,GitHub:GitHub,MyPage:MyPage}}
          onSubmit={(values) => this.onhandleSubmit(values)}
          validationSchema={Yup.object().shape({
            UserName:Yup.string().min(1).max(30,'チーム名は30文字以内です。').required(),
            description:Yup.string().max(1000,'1000文字以内です。').required(),
            twitter:Yup.string().max(15,'15文字までです。'),
            MyPage:Yup.string()
          })}
        >
          {
            ({handleSubmit, handleChange, handleBlur, values, errors, touched}) => (
              
              <form style={{width:'100%'}} onSubmit={handleSubmit}>
                <DialogContent>
                <TextField
                required
                margin='dense'
                id='UserName'
                label='UserName'
                value={values.UserName}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                />
                <TextField
                required
                margin="dense"
                id="description"
                label="チームについて"
                rows='5'
                multiline
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                />
                
                <div style={{height:'1rem'}} />
                
                <div>
                  
                  <TextField
                  InputProps={{
                    startAdornment:<InputAdornment position='start'>@</InputAdornment>
                  }}
                  id='twitter'
                  fullWidth
                  label='Twiiterアカウント'
                  value={values.twitter}
                  onChange={handleChange}
                  />
                </div>
                <div style={{height:'1rem'}} />
                <div>
                  <TextField
                  InputProps={{
                    startAdornment:<InputAdornment position='start'>https://github.com/</InputAdornment>
                  }}
                  id='GitHub'
                  fullWidth
                  label='GitHubアカウント'
                  value={values.GitHub}
                  onChange={handleChange}
                  />
                </div>
                <div>
                  <TextField
                  InputProps={{
                    startAdornment:<InputAdornment position='start'>https://</InputAdornment>
                  }}
                  id='MyPage'
                  fullWidth
                  label='ホームページやブログ等'
                  value={values.MyPage}
                  onChange={handleChange}
                  />
                </div>
                
              </DialogContent>
              <DialogActions>
                <Button onClick={()=>this.handleClose()} color="primary">
                キャンセル
                </Button>
                <Button type='submit' color="primary">
                  更新
                </Button>
              </DialogActions>
              </form>
              
            )
          }
          </Formik>     
        
      </Dialog>
      {/* 編集ダイアログの終わり */}

        <Container className={"profile_cardGrid"} maxWidth="md">
        <Typography component={'h2'} variant="h3">Portfolio</Typography>
        <div>
        <Cliploader loading={this.state.loading} />
        </div>
          {/* End hero unit */}
          {this.state.myPosts.length > 0 ?
          <Grid style={{minHeight:'100px'}} container spacing={4}>
          {this.state.myPosts.map((card,index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card className={"profile_card"}>
                
                <CardActionArea onClick={()=>this.naviBody(card)} >
                <CardMedia
                  className={"profile_cardMedia"}
                  image={card.thumbnail}
                  title={card.SiteName}
                />
                
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.SiteName}
                    </Typography>
                    
                </CardContent>
                </CardActionArea>

                <CardActions>
                  <Button size='medium' color='primary' onClick={()=>this.naviEdit(card,index)} >
                    更新 
                  </Button>
                  <Button size='medium' color='primary' onClick={()=>this.deleteMyPosts(card.key,index)}>
                    削除
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        :
        <Typography variant="h6" color="textSecondary" paragraph>
          ここにはSubmitから投稿した自分のポートフォリオが表示されます。
        </Typography>
          
        }
          

          <div style={{height:'50px'}} />
          <Typography component={'h2'} variant="h3">Favorite</Typography>
          {/* End hero unit */}
          {this.state.favorites.length>0 ?
          <Grid container spacing={4}>
          {this.state.favorites.map((card,index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              
              <Card className={"profile_card"}>
              <CardActionArea onClick={()=>this.naviBody(card)}>
                <CardMedia
                  className={"profile_cardMedia"}
                  image={card.thumbnail}
                  title={card.SiteName}
                />
              
                <CardContent className={"profile_cardContent"}>
                  <Typography gutterBottom variant="h6" >
                    {card.SiteName}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Link className={'profile_Link'} to={`/oprofile/${card.uid}`}>
                <CardActions>
                  <Typography gutterBottom>
                    <span style={{marginRight:7}}>by</span>{card.UserName}
                  </Typography>
                </CardActions>
              </Link>
                <CardContent className={"profile_CardContent2"}>
                  <Button onClick={()=>this.deleteFavorites(card.key,index)}>
                    削除
                  </Button>
                </CardContent>
              
                  
              
                
              </Card>
             
            </Grid>
          ))}
        </Grid>
        :
        <Typography variant="h6" color="textSecondary" paragraph>
          他の人の投稿にスターをつけましょう！
        </Typography>
          
          }
        <div className={'profile_space20'} />
        <div className={"profile_deleteAccount"}>
          <Button onClick={()=>this.setState({open2:true})} className={"profile_deleteAccountButton"}>アカウント削除</Button>
        </div>

        </Container>
      <Dialog className={"profile_Dialog"} open={this.state.open2} onClose={()=>this.setState({open2:true})} aria-labelledby="deleteaccount">
        <DialogTitle id="deleteaccount">アカウント削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            今まで投稿・保存した作品は全て即刻削除されます。
            アカウントを削除しますか？
          </DialogContentText>
        </DialogContent>
              <DialogActions>
                <Button onClick={()=>this.deleteUser()}>
                  削除
                </Button>
                <Button onClick={()=>this.setState({open2:false})}>
                  キャンセル
                </Button>
              </DialogActions>
        
      </Dialog>

    </React.Fragment>
  )
  }
}

const Profile = (props) => (
  <Subscribe to={[Store]}>
    {Store =>
    <WrappedProfile Store={Store} navigation={props} />
    }
  </Subscribe>
)
export default withRouter(Profile)