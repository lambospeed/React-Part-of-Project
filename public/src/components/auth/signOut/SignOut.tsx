import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom'
import { signOutUser } from 'actions'
import * as state from 'reducers'
import { IsSignedIn, DeleteToken } from 'api'

type OwnProps = { }

type SigningOutState = { isSigningOut: boolean }

type ConnectedState = SigningOutState

type ConnectedDispatch = { signOut: () => void }

type IProps = ConnectedState & ConnectedDispatch & OwnProps & RouteComponentProps<{}>

const mapStateToProps = (state: state.All, ownProps: OwnProps): ConnectedState => ({
  isSigningOut: state.isSigningOut
})

const mapDispatchToProps = (dispatch: redux.Dispatch<state.All>): ConnectedDispatch => ({
  signOut: () => dispatch(signOutUser()),
})

class SignOutComponent extends React.Component<IProps, {}> {

  _onClickSignOut = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!this.props.isSigningOut) {
      DeleteToken()
      this.props.signOut()
      this.props.history.push("/signIn")
    }
  }

  render () {
    if (IsSignedIn()) {
      const { isSigningOut } = this.props
      return <button ref='signOut' disabled={ isSigningOut } onClick={ this._onClickSignOut } className="btn btn-primary">{ isSigningOut ? 'signing out...' : 'sign out'}</button>
    } else { return <Redirect to='/signIn' /> }
  }
}

export const SignOut = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SignOutComponent)
)
