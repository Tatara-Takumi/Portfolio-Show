import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom';



const useStyles=makeStyles((theme) => ({
    footer:{
      backgroundColor: 'black',
      padding: theme.spacing(6),
    },
    container:{
      textAlign:'center',
      flexWrap:'wrap'
    },
    Link:{
      color:'white',
      fontSize:12,
      padding: theme.spacing(1)
    }
}))

export default function Footer() {
    const classes = useStyles();
    return(
        <React.Fragment>
        <footer className={classes.footer}>
            <Typography style={{color:'white'}} variant="h6" align="left" gutterBottom>
            Portfolio Show
            </Typography>
            <div className={classes.container}>
              <ul>
                {/* <li style={{display:'inline'}}>
              <Link className={classes.Link} to={'/about'}>Portfolio Showとは</Link>
              </li> */}
              <li style={{display:'inline'}}>
              <Link className={classes.Link} to='/privacypolicy'>プライバシーポリシー</Link>
              </li>
              <li style={{display:'inline'}}>
              <Link className={classes.Link} to="/terms">利用規約</Link>
              </li>
              <li style={{display:'inline'}}>
              <Link className={classes.Link} to='/form'>お問い合わせ</Link>
              </li>
              </ul>

            </div>
        </footer>
        </React.Fragment>
    )
}

