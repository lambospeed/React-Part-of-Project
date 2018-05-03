import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IsSignedIn } from 'api'

const PrivateRoute = ({component: Component, ...rest }: any) => (
  <Route {...rest} render={PrivateRender(Component)} />
);

const PrivateRender = (Component: any) => {
  return (props: any) => {
    return (
      IsSignedIn()
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/signIn', state: { from: props.location } }} />
    )
  };
}

export default PrivateRoute
