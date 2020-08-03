import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import {Link, withRouter} from 'react-router-dom'
import  MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Drawer from '@material-ui/core/Drawer'

import { Subscribe } from 'unstated';
import Store from "../Store";


const useStyles= makeStyles((theme) => ({
    Appbar:{
        backgroundColor:'black'
    },
    Drawer_list:{
        width:250,
    },
    GoogleLogin:{
        width:'200px'
    },
    Menus:{
        display:'none',
        marginLeft:'auto',
        [theme.breakpoints.up('sm')]:{
            display:'block',
            marginLeft:'auto',
        },
    },
    Menu_700:{
        display:'block',
        marginLeft:'auto',
        [theme.breakpoints.up('sm')]:{
            display:'none',
            marginLeft:'auto'
        }
    },
    root_drawer:{
        backgroundColor:'black'
    },
    Menu_GitHub:{
        display:"flex"
    },
    Menu_Button:{
        marginLeft:"5px",
        padding:'0px'
    },
    Menu_Button_Icon:{
        marginRight:"10px"
    },
    HomeLink:{
        textDecorationLine:'none',
        color:'white'
    },
    submit:{
        textDecorationLine:'none',
        color:'white',
        marginRight:'0.5em'
    },
    profile:{
        marginRight:'0.5em',
        textDecorationLine:'none',
        color:'white'
    },
    SignUp:{
        marginRight:'0.5em',
        textDecorationLine:'none',
        color:'white'  
    },
    Link:{
        textDecorationLine:'none',
        color:'white'
    },  
    Button:{
        color:'white'
    },
    LogOut:{
        textDecorationLine:'none',
        color:'white'
    },
    toolbar:theme.mixins.toolbar

}))



function WrappedNavBar(props){
    
    const classes = useStyles();
    const [open,setOpen] = React.useState(false)

    const toggleDrawer = () =>  {
        setOpen(true)
    };

    const toggleDownDrawer = () => {
        setOpen(false)
    };
    
    const LogOut = () => {
        firebase.auth().signOut().then(async function () {
            await props.Store.logInStateSet(false)
            // Sign-out successful.
          }).catch(function (error) {
            // An error happened.
          });
    }



    return(
        <React.Fragment>    
        <CssBaseline />
        <AppBar position="fixed" className={classes.Appbar}>
            <Toolbar>
            <Link to={'/'} className={classes.HomeLink}>
                <Typography variant="h6" color="inherit" noWrap>
                    Portfolio Show
                </Typography>
            </Link>

            {/* Menu for sm up */}
            <div className={classes.Menus}>
                <Link to={'/submit'} className={classes.submit}>Submit</Link>
                <Link to={'/profile'} className={classes.profile}>Profile</Link> 
                
                {props.Store.state.logInState ?
                    <Button className={classes.LogOut} onClick={LogOut}>ログアウト</Button>  
                    :
                    <Link to={"/login"} className={classes.SignUp} >新規登録/ログイン</Link>
                }
                
            </div>
            {/* Menu for 700 down */}
            <div className={classes.Menu_700}>
                <IconButton 
                 onClick={toggleDrawer}
                 style={{color:'white'}}>
                    <MenuIcon />
                </IconButton>
                <Drawer
                anchor="right"
                open={open}
                onClose={toggleDownDrawer}
                classes={{
                    paper:classes.root_drawer
                }}
                >
                    <List className={classes.Drawer_list}>
                        <ListItem>
                            {props.Store.state.logInState ? 
                            <Button className={classes.Button} onClick={LogOut}>ログアウト</Button>    
                            :
                            <Link className={classes.Link} to={'/login'}>新規登録・ログイン</Link>
                        }
                        </ListItem>
                        <ListItem>
                            <Button>
                            <Link className={classes.Link} to={'/submit'}>Submit</Link>
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button>
                            <Link className={classes.Link} to={'/profile'}>Profile</Link>
                            </Button>
                        </ListItem>
                    </List>
                </Drawer>
            </div>

            </Toolbar>
        </AppBar>
        <Toolbar className={classes.toolbar}></Toolbar>
        </React.Fragment>
    )
}

const NavBar = (props) => (
    <Subscribe to={[Store]}>
        {Store => 
            <WrappedNavBar Store={Store} navigation={props} />
        }
    </Subscribe>
)

export default withRouter(NavBar)