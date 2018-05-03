import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { SignIn } from 'components/auth/signIn/SignIn';
import { SignUp } from 'components/auth/signUp/SignUp';
import Map from 'components/map/Map';
import Home from 'components/home/Home';
import Dashboard from 'components/dashboard/Dashboard';
import PrivateRoute from 'components/privateRoute/PrivateRoute';
import { ThemeProvider } from 'styled-components';
import THEME from './global-theme';

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={THEME}>
      <BrowserRouter basename="/app">
        <div>
          <Route exact path="/" component={ () => <Home /> } />
          <Switch>
            <Route exact path="/dashboard" component={ () => <Dashboard /> } />
            <Route exact path="/signIn" component={ () => <SignIn /> } />          
            <Route exact path="/signUp" component={ () => <SignUp /> } />
            <Route
              exact
              path="/signUp/verify/:token"
              component={ () => this._getSignInTemplate() }
            />
            <PrivateRoute exact path="/map" component={ () => <Map /> } />
          </Switch>
        </div>
      </BrowserRouter>
      </ThemeProvider>
    );
  }

  _getSignInTemplate() {
    let fullNameMeta: Element | null =
      document.head.querySelector("[name=fullName]")
    let expiredMeta: Element | null =
      document.head.querySelector("[name=expired]")
    let errorMeta: Element | null =
      document.head.querySelector("[name=error]")
    if (expiredMeta && fullNameMeta) {
      let fullName: string | null = fullNameMeta.getAttribute("content");
      const expiredStr: string | null = expiredMeta.getAttribute("content")
      let expired: boolean = false
      if (expiredStr) { expired = (expiredStr.toLowerCase() === 'true') }
      fullNameMeta.remove()
      expiredMeta.remove()
      if (errorMeta) { errorMeta.remove() }
      if (expired) {
        let error: string = "Expired link! We just sent you a new email verification link."
        console.error(error)
        return <SignIn errorMsg={ error } />
      } else {
        let mesg: string =
          `Your email account has been verified ${fullName}. Please sign in.`
        console.log(mesg)
        return <SignIn message={ mesg } />
      }
    } else if (errorMeta) {
      let errorMsg: string = errorMeta.getAttribute("content") ||
        "Unknown error during email verification (0). Please contact support."
      console.log(`Error = ${errorMsg}`)
      errorMeta.remove()
      return <SignIn errorMsg={ `Error: ${errorMsg}` } />
    } else {
      return <SignIn
        errorMsg={
          "Unknown error during email verification (1). Please contact support."
        }
      />
    }
  }
}

export default App;
