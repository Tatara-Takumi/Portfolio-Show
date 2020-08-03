import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withRouter　} from 'react-router-dom';
import firebase from 'firebase/app'
import Cliploader from '../components/Loader'
import Helmet from '../components/Helmet'
import '../styles/Album.css'
import  CardActionArea  from '@material-ui/core/CardActionArea';
import { Subscribe } from 'unstated';
import Store from "../Store";



class WrappedAlbum extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      tempLength:5,//本番は20?
      posts:[],
      loading:true,
      LastDate:"",
      buttonTitle:'もっと見る',
      isDisabled:false,
    };
  }

  async componentDidMount() {
    let temp = []
    await firebase.firestore().collection('posts').orderBy('createdAt','desc').limit(this.state.tempLength).get()
    .then(function (qs) {
      qs.forEach(function(doc){
        temp.push({...doc.data(),key:doc.id})
      })
    })
    .catch(function(error) {
      console.error(error)
    })
    this.setState({posts:temp})
    if(temp.length === this.state.tempLength){
      this.setState({LastDate:temp[temp.length-1].createdAt})
    }else{
      this.setState({isDisabled:true})
    }
    this.setState({loading:false})

  }
  


  fetchMoreData = async() => {
    let fetchTemp = []
    await firebase.firestore().collection('posts').orderBy('createdAt','desc').startAfter(this.state.LastDate).limit(this.state.tempLength).get()
      .then(function(qs) {
        qs.docChanges().forEach(function(changes){
          fetchTemp.push({...changes.doc.data(),key:changes.doc.key})
        })
      })
      .catch(function(e) {
        console.error(e)
      })
      this.setState({posts:this.state.posts.concat(fetchTemp)})
      if(fetchTemp.length<this.state.tempLength){
        this.setState({isDisabled:true})
      }else{
        this.setState({LastDate:fetchTemp[fetchTemp.length-1].createdAt})
      }
      
      
      

  }

  naviBody = async(value) => {
    await this.props.Store.fieldSet(value)
    this.props.navigation.history.push(`/body/${value.key}`)

  }
  navioProfile = async(value) => {
    
    this.props.navigation.history.push(`/oprofile/${value.uid}`)
  }

  render() {
  
  
  return (
    <React.Fragment>
      <Helmet title={'Portfolio Show'} desctription='Portfolio Showは誰でも気軽に投稿できるポートフォリオ投稿サイトです。個人やチームのポートフォリオとしても活用できます！' />
      <div className={'Album_root'}>
        <Container className={"Album_top"} maxWidth='md'>
          <div className={'Album_topContent'}>
            <h1 className={"Album_h1"}>Webプログラマーのポートフォリオ</h1>
            <p>Portfolio Showは誰でも気軽に投稿できるポートフォリオ投稿サイトです。</p>
            <p>個人やチームのポートフォリオとしても活用できます！</p>
          </div>
        </Container>
        <div className={"Album_space"} />

        <Container className={"cardGrid"} maxWidth="xl">
          <div>
            <Cliploader loading={this.state.loading} />
          </div>
          {/* End hero unit */}          
          <Grid container spacing={4}>
            {this.state.posts.map((card,index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <CardActionArea onClick={()=>this.naviBody(card)} style={{height:'100%'}}>
                <Card className={"card"}>
                  
                    <CardMedia
                      className={"Album_cardMedia"}
                      image={card.thumbnail}
                      title={card.SiteName}
                    />

                  <CardContent className={"cardContent"}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.SiteName}
                      </Typography>
                  </CardContent>
                  <CardActions>
                    {/* <div className={classes.tags}>
                        <Typography>
                        Tags:
                        </Typography>
                        {tags.map((tag) => (
                            <React.Fragment>
                            <Typography>
                                {tag}
                            </Typography>
                            <div style={{width:'1em'}} />to={`oprofile/${card.uid}`}
                            </React.Fragment>
                        ))}
                    </div> */}
                    <Typography gutterBottom>
                      <span className={'mgr-10'}>By</span>{card.UserName}
                    </Typography>
                  </CardActions>
                   
                </Card>
                </CardActionArea>
              </Grid>
            ))}
          </Grid>
          <div className={'Album_space'} />
          

          {/* <div style={{height:30}} /> */}
        </Container>
      </div>
      <div className={"Album_moreButton"}>
          <Button 
            onClick={()=>this.fetchMoreData()}
            disabled={this.state.isDisabled}
            style={{width:'30%'}}
            variant="contained"
            color="primary" >
              {this.state.buttonTitle}
            </Button>
              
         
          <div className={'Album_space'} />
      </div>
      
    </React.Fragment>
  );
  }
}

const Album = (props) => (
  <Subscribe to={[Store]}>
    {Store =>
      <WrappedAlbum Store={Store} navigation={props} />
    }
  </Subscribe>
)

export default withRouter(Album)