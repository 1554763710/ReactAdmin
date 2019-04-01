
import React,{Component} from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import Login from "./pages/login";
import Admin from "./pages/admin";

export default class App extends Component{
  render(){
    return <Switch>
      <Route path="/login" component={Login}/>
      <Redirect to="/login" />
      <Route path="/" component={Admin}/>
    </Switch>
  }
}