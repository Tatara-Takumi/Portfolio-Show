import React, { useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles';
import { withRouter} from 'react-router-dom'
import Helmet from '../components/Helmet'

const useStyles= makeStyles((theme) => ({
    root:{
        minHeight:'100vh'
    },
}))



function About(props){
    useEffect(() => {
        window.scrollTo(0,0)
    })
    const classes = useStyles();
    return(
        <React.Fragment>  
            <Helmet title={'Portfolio Show'} desctription='Portfolio Showは誰でも気軽に投稿できるポートフォリオ投稿サイトです。個人やチームのポートフォリオとしても活用できます！' />  
        <CssBaseline />
        <Container className={classes.root} maxWidth='md'>
            <h1>Portfoli Showについて</h1>
                <p>
                    ただいま準備中です。
                </p>
        </Container>
        </React.Fragment>
    )
}


export default withRouter(About)