import React, { useEffect,useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router-dom';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import { Subscribe } from 'unstated';
import Store from "../Store";
import firebase from 'firebase/app'
import Helmet from '../components/Helmet'


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },

}));


function WrappedProfileForOthers(props) {
  const classes = useStyles();
  const [ouser,setOuser] = useState([])
  const [posts,setPosts] = useState([])

  useEffect(() => {
    window.scrollTo(0,0)
    let usertemp=[]
    let poststemp=[]
    async function fetchUser(){
      await firebase.firestore().collection('users').doc(props.navigation.match.params.id).get()
      .then(async function(doc){
        usertemp.push({...doc.data(),key:doc.id})
        setOuser(usertemp['0'])
      })
      .catch(function(err){
        console.error(err)
      })
    }
    fetchUser()

    async function fetchPosts(){
      await firebase.firestore().collection('posts').where("uid","==",props.navigation.match.params.id).get()
        .then(function (qs){
          qs.forEach(function(doc){
            poststemp.push({...doc.data(),key:doc.id})
          })
        })
        .catch(function(err){
          console.error(err)
        })
        setPosts(poststemp)
    }
    fetchPosts()
    
  },[props.navigation.match.params.id])

  const naviBody = async(value) => {
    
    await props.Store.fieldSet(value)
    props.navigation.history.push(`/body/${value.key}`)
  }


  return (
    <React.Fragment>        
        <Helmet title={'Portfolio Show'} desctription='Portfolio Showは誰でも気軽に投稿できるポートフォリオ投稿サイトです。個人やチームのポートフォリオとしても活用できます！' />  
        <div className={classes.heroContent}>
          
          <Container maxWidth="md">
                <div style={{maxHeight:'300px'}}>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                {ouser.UserName}
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                {ouser.description}
                </Typography>
                </div>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  {ouser.twitter ? <a href={'https://twitter.com/'+ouser.twitter}><TwitterIcon /></a> : null}
                </Grid>
                <Grid item>
                  {ouser.GitHub ? <a href={'https://github.com/'+ouser.GitHub}><GitHubIcon /></a> : null }
                </Grid>
                <Grid item>
                  {ouser.MyPage ? <a href={ouser.MyPage}><WebAssetIcon /></a> : null}
                </Grid>
                
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
        <Typography component={'h1'} variant="h3">Portfolio</Typography>
          {/* End hero unit */}
          <Grid container spacing={4}>
            {posts.map((value,index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={value.thumbnail}
                    title={value.SiteName}
                  />
                  
                  <CardActions>
                    <Button size="small" color="primary" onClick={()=>naviBody(value,index)}>
                      {value.SiteName}
                    </Button>
                  
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <div style={{height:'50px'}} />
          
        </Container>      
    </React.Fragment>
  );
}

const ProfileForOthers = (props) => (
  <Subscribe to={[Store]}>
    {Store => 
      <WrappedProfileForOthers Store={Store} navigation={props} />
    }
  </Subscribe>
)

export default withRouter(ProfileForOthers)