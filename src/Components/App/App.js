import React, { Component } from "react";
import "./App.css";
import Footer from "../../constants/Footer.js";
import Home from "../Home.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import About from "../About.js";
import Contact from "../Contact.js";
import Chat from "../Chat/Chat.js";
import * as Routes from "../../constants/routes.js";
import { AuthProvider } from "../Firebase/Auth";
import PrivateRoute from "../Firebase/PrivateRoute.js";
import SignUp from "../Login/Signup";
import InternalHeader from "../../Internal/InternalHeader";

class App extends Component {
  render() {
    return (
      <div className="App">
        <AuthProvider>
          <Router>
            <Switch>
              <Route exact path={Routes.LANDING} component={Home} />
              <Route path={Routes.ABOUT} component={About} />
              <Route path={Routes.CONTACT} component={Contact} />
              <Route path={Routes.CHAT} component={Chat} />
              <Route path={Routes.SIGN_UP} component={SignUp} />
  
            <PrivateRoute
              path={Routes.INTERNAL_CHAT}
              component={InternalHeader}
            />
            </Switch>            
            <Footer />
          </Router>
        </AuthProvider>
      </div>
    );
  }
}

export default App;
