import {Container} from 'unstated'

class Store extends Container {
    state = {
        logInState:true,
        displayName:"",
        uid:"",
        field:[],
        UserInfo:[]
    }
    UserInfoSet(UserInfo){
        this.setState({UserInfo:UserInfo})
    }
    logInStateSet(LogInState){
        this.setState({logInState:LogInState})
    }
    displayNameSet(DisplayName){
        this.setState({displayName:DisplayName})
    }
    uidSet(Uid){
        this.setState({uid:Uid})
    }
    fieldSet(Field){
        this.setState({field:Field})
    }
}

export default Store