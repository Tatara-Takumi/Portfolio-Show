import React, { Component } from 'react';
import './App.css';
import Album from './pages/Album'
import Edit from './pages/edit'
import LogIn from './pages/LogIn'
import Body from './pages/body';
import Submit from './pages/submit'
import oProfile from './pages/profileForOthers'
import Profile from './pages/profile'
import NavBar from './pages/NavBar';
import Footer from './pages/footer'
import Terms from './pages/terms'
import About from './pages/about'
import PrivacyPolicy from './pages/privacyPolicy'
import CreateUserInfo from './pages/createUserInfo';
import Form from './pages/form'
import { BrowserRouter as Router, Route ,Switch, Redirect} from 'react-router-dom';
import { Provider, Subscribe } from 'unstated';
import firebase from 'firebase/app';
import "firebase/firestore";
import Store from './Store'

class WrappedApp extends Component {
  constructor(props){
    super(props);
    this.state={}
  }

  async componentDidMount(){
    if(this.props.Store.state.uid.length > 0){
    }else{
      firebase.auth().onAuthStateChanged(async user => {
        if(user){
          this.props.Store.uidSet(user.uid)
        }else{
          await this.props.Store.logInStateSet(false)
        }
      })
    }
    
  }
  
  render(){

  return (
    <div className="App">
      <Router>
        <NavBar />
        {this.props.Store.state.logInState ? 
          
          <Switch>
            <Route exact path='/' component={Album} />
            <Route exact path='/login' component={LogIn} />
            <Route exact path="/body/:id" component={Body} />
            <Route exact path='/edit/:id' component={Edit} />
            <Route exact path='/submit' component={Submit} />
            <Route exact path='/profile' component={Profile} />
            <Route exact path='/oprofile/:id' component={oProfile} />
            <Route exact path='/terms' component={Terms}/>
            <Route exact path='/about' component={About} />
            <Route exact path='/privacypolicy' component={PrivacyPolicy} />
            <Route exact path='/form' component={Form} />      
          </Switch>
          :
          <Switch>
            <Route exact path='/' component={Album} />
            <Route exact path='/login' component={LogIn} />
            <Route exact path='/createuser' component={CreateUserInfo} />
            <Route exact path="/body/:id" component={Body} />
            <Route exact path='/oprofile/:id' component={oProfile} />
            <Route exact path='/terms' component={Terms}/>
            <Route exact path='/about' component={About} />
            <Route exact path='/privacypolicy' component={PrivacyPolicy} />
            <Route exact path='/form' component={Form} />
            <Redirect to={'/login'} />
          </Switch>
      }
          
        <Footer />
        </Router>
    </div>
  );
  }
}
const App = () => (
  <Provider>
    <Subscribe to={[Store]}>{Store => <WrappedApp Store={Store} /> }</Subscribe>
  </Provider>
)


export default App;
