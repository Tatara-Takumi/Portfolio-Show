import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles';
import { withRouter} from 'react-router-dom'
import Helmet from '../components/Helmet'

const useStyles= makeStyles((theme) => ({
    space:{
        height:'20px'
    },
    root:{
        textAlign:'center',
    }
}))



function Form(props){
    
    const classes = useStyles();
    return(
        <React.Fragment>   
            <Helmet title={'お問い合わせ |Portfolio Show'} desctription='Portfolio Showは誰でも気軽に投稿できるポートフォリオ投稿サイトです。個人やチームのポートフォリオとしても活用できます！' />
        <CssBaseline />
        <Container className={classes.root} maxWidth='md'>
        <iframe title='Googleアンケート' scrolling='no' src="https://docs.google.com/forms/d/e/1FAIpQLSd2CjvtdJKXsIkYVnbgL_sqhSAI9gRcyCG_y3ia_DHttVNz2g/viewform?embedded=true" width="640" height="1059" frameborder="0" marginheight="0" marginwidth="0">読み込んでいます…</iframe>
        </Container>
        
        </React.Fragment>
    )
}

export default withRouter(Form)