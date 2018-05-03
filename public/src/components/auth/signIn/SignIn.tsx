import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom'
import { signInUser, resetMessages } from 'actions'
import { Credentials, SignInData } from 'models/auth'
import * as state from 'reducers'
import loadable from 'decorators/loadable'
import { IsSignedIn } from 'api'

import * as styles from './SignIn.scss'

type OwnProps = {
  errorMsg?: string, message?: string
} & RouteComponentProps<{}>

type SigningInState = {
  isSigningIn: boolean
}

type ConnectedState = SigningInState & {
  credentials: Credentials,
  error: string
}

type ConnectedDispatch = {
  signIn: (data: SignInData) => void, resetMessages: () => void
}

type IProps = ConnectedState & ConnectedDispatch & OwnProps

const mapStateToProps = (state: state.All, ownProps: OwnProps): ConnectedState => ({
  credentials: state.credentials,
  isSigningIn: state.isSigningIn,
  error: state.authError
})

const mapDispatchToProps = (dispatch: redux.Dispatch<state.All>): ConnectedDispatch => ({
  signIn: (data: SignInData) => dispatch(signInUser(data)),
  resetMessages: () => dispatch(resetMessages())
})

interface ISignInState { data: SignInData }

class SignInComponent extends React.Component<IProps, ISignInState> {

  constructor(props: IProps, state: ISignInState) {
    super(props)
    this.state = { data: { email: '', password: '', rememberMe: true } }
  }

  _handleEmail = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('Typed email: ', e.currentTarget.value);
    let email: string = e.currentTarget.value;
    this.setState((current) => ({
      ...current, data: { ...current.data, email: email }
    }));
  }

  _handlePassword = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('Typed password: ', e.currentTarget.value);
    let password: string = e.currentTarget.value;
    this.setState((current) => ({
      ...current, data: { ...current.data, password: password }
    }));
  }

  _onClickSignIn = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!this.props.isSigningIn) {
      this.props.signIn(this.state.data)
    }
  }

  _onClickSignUp = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!this.props.isSigningIn) {
      this.props.resetMessages()
      this.props.history.push("/signup")
    }
  }

  render () {
    if (IsSignedIn()) {
      return <Redirect to='/' />
    } else {
      const { errorMsg, error, isSigningIn, message } = this.props
      return <div className={styles['container-wrapper']}><div className={styles["signin-container"]}>
        <div className={styles['signin-form']}>
          <div className={styles['signin__logo']}></div>
          <div className={styles['signin__title']}>
            SATORI
            <div>{ message ? <p className={styles['message']}>{ message }</p> : null }</div>

          </div>
          <form>

            <input
              type='text'
              name='Email'
              value={ this.state.data.email }
              onChange={ this._handleEmail }
              className={styles["form-control"]}
              style={{ marginRight: '5px' }}
              placeholder='Email'
            />
            <br />
            <input
              type='password'
              name='Password'
              value={ this.state.data.password }
              onChange={ this._handlePassword }
              className={styles["form-control"]}
              style={{ marginRight: '5px' }}
              placeholder='Password'
            />
            <br />

            <div className={styles["signin__container"]}>
              <button ref='signIn' disabled={ isSigningIn } onClick={ this._onClickSignIn } className={styles["signin__submit-button"]}>
                { isSigningIn ? 'signing in...' : 'Sign In'}
              </button>
              <button className={styles['signin__button'] + ' ' + styles['signin__button--facebook']}>Facebook</button>
              <button className={styles['signin__button'] + ' ' + styles['signin__button--google']}>Google</button>
            </div>

            <div className={styles['signin__signin-link']}>
              <a onClick={this._onClickSignUp}>Create new account</a>
              <br/>
              { error ? <div className={styles['error']}>{ error }</div> : null }
              { errorMsg ? <div className={styles['error']}>{ errorMsg }</div> : null }
            </div>

          </form>
          </div>
          <div className={styles['signin-splashscreen']}>
          </div>

      </div>
      </div>
    }
  }
}

const IsSigningIn = (p: SigningInState) => p.isSigningIn

export const SignIn = withRouter(
  connect<ConnectedState, ConnectedDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps
  )(loadable(IsSigningIn)(SignInComponent))
)
