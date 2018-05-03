import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'
import { Redirect, withRouter, RouteComponentProps } from 'react-router-dom'
import { resetMessages, signUpUser } from 'actions'
import { Credentials, SignUpData } from 'models/auth'
import * as state from 'reducers'
import loadable from 'decorators/loadable'
import { IsSignedIn } from 'api'

import * as styles from './SignUp.scss'

type OwnProps = {
} & RouteComponentProps<{}>

type SigningUpState = {
  isSigningUp: boolean
}

type ConnectedState = SigningUpState & {
  credentials: Credentials,
  error: string,
  message: string
}

type ConnectedDispatch = {
  signUp: (data: SignUpData) => void, resetMessages: () => void
}

type IProps = ConnectedState & ConnectedDispatch & OwnProps

const mapStateToProps = (state: state.All, ownProps: OwnProps): ConnectedState => ({
  credentials: state.credentials,
  isSigningUp: state.isSigningUp,
  error: state.authError,
  message: state.message
})

const mapDispatchToProps = (dispatch: redux.Dispatch<state.All>): ConnectedDispatch => ({
  signUp: (data: SignUpData) => dispatch(signUpUser(data)),
  resetMessages: () => dispatch(resetMessages())
})

interface ISignUpState { data: SignUpData }

class SignUpComponent extends React.Component<IProps, ISignUpState> {

  constructor(props: IProps, state: ISignUpState) {
    super(props);
    this._handleEmail = this._handleEmail.bind(this);
    this.state = {
      data: {
        credentials: {
          email: '', username: '', firstName: '', lastName: ''
        },
        password: '',
        confirmPassword: ''
      }
    }
  }

  _handleEmail = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('Typed email: ', e.currentTarget.value);
    let email: string = e.currentTarget.value;
    this.setState((current) => ({
      ...current,
      data: {
        ...current.data,
        credentials: {
          ...current.data.credentials,
          email: email
        }
      }
    }));
  }

  _handleUsername = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('Typed username: ', e.currentTarget.value);
    let username: string = e.currentTarget.value;
    this.setState((current) => ({
      ...current,
      data: {
        ...current.data,
        credentials: {
          ...current.data.credentials,
          username: username
        }
      }
    }));
  }

  _handlePassword = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('Typed password: ', e.currentTarget.value);
    let password: string = e.currentTarget.value;
    this.setState((current) => ({
      ...current,
      data: {
        ...current.data,
        password: password
      }
    }));
  }

  _handleConfirmPassword = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('Typed confirm password: ', e.currentTarget.value);
    let confirmPassword: string = e.currentTarget.value;
    this.setState((current) => ({
      ...current,
      data: {
        ...current.data,
        confirmPassword: confirmPassword
      }
    }));
  }

  _handleFirstName = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('Typed firstName: ', e.currentTarget.value);
    let firstName: string = e.currentTarget.value;
    this.setState((current) => ({
      ...current,
      data: {
        ...current.data,
        credentials: {
          ...current.data.credentials,
          firstName: firstName
        }
      }
    }));
  }

  _handleLastName = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('Typed lastName: ', e.currentTarget.value);
    let lastName: string = e.currentTarget.value;
    this.setState((current) => ({
      ...current,
      data: {
        ...current.data,
        credentials: {
          ...current.data.credentials,
          lastName: lastName
        }
      }
    }));
  }

  _onClickSignUp = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!this.props.isSigningUp) {
      this.props.signUp(this.state.data)
    }
  }

  _onClickSignIn = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!this.props.isSigningUp) {
      this.props.resetMessages()
      this.props.history.push('/signIn')
    }
  }

  render () {
    if (IsSignedIn()) {
      return <Redirect to='/' />
    } else {
      const { error, isSigningUp, message } = this.props
      return  <div className={styles['container-wrapper']}><div className={styles['signup-container']}>
        <div className={styles['signup-form']}>
          <div className={styles['signup__logo']}></div>
          <div className={styles['signup__title']}>
            SATORI
            <div>{ message ? <p className={styles['message']}>{ message }</p> : null }</div>
          </div>
          <form>
            <input
              type='text'
              name='First Name'
              value={ this.state.data.credentials.firstName }
              onChange={ this._handleFirstName }
              className={styles['form-control']}
              style={{ marginRight: '5px' }}
              placeholder='First Name'
            />
            <br />
            <input
              type='text'
              name='Last Name'
              value={ this.state.data.credentials.lastName }
              onChange={ this._handleLastName }
              className={styles['form-control']}
              style={{ marginRight: '5px' }}
              placeholder='Last Name'
            />
            <br />
            <input
              type='text'
              name='Email'
              value={ this.state.data.credentials.email }
              onChange={ this._handleEmail }
              className={styles['form-control']}
              style={{ marginRight: '5px' }}
              placeholder='Email'
            />
            <br />
            <input
              type='text'
              name='Username'
              value={ this.state.data.credentials.username }
              onChange={ this._handleUsername }
              className={styles['form-control']}
              style={{ marginRight: '5px' }}
              placeholder='Username'
            />
            <br />
            <input
              type='password'
              name='Password'
              value={ this.state.data.password }
              onChange={ this._handlePassword }
              className={styles['form-control']}
              style={{ marginRight: '5px' }}
              placeholder='Password'
            />
            <br />
            <input
              type='password'
              name='Confirm Password'
              value={ this.state.data.confirmPassword }
              onChange={ this._handleConfirmPassword }
              className={styles['form-control']}
              style={{ marginRight: '5px' }}
              placeholder='Confirm Password'
            />
            <br />

            <div className={styles["signup__container"]}>
              <button ref='signUp' disabled={ isSigningUp } onClick={ this._onClickSignUp } className={styles['signup__submit-button']}>
                { isSigningUp ? 'creating acc...' : 'Sign Up'}
              </button>
              <button className={styles['signup__button'] + ' ' + styles['signup__button--facebook']}>Facebook</button>
              <button className={styles['signup__button'] + ' ' + styles['signup__button--google']}>Google</button>
            </div>


            <div className={styles['signup__signin-link']}>
              Already a member? <a onClick={this._onClickSignIn}>Sign In</a>
              { error ? <div className={styles['error']}>{ error }</div> : null }
            </div>

          </form>
          </div>
          <div className={styles['signup-splashscreen']}>
          </div>
      </div>
      </div>
    }
  }
}

const IsSigningUp = (p: SigningUpState) => p.isSigningUp

export const SignUp = withRouter(
  connect<ConnectedState, ConnectedDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps
  )(loadable(IsSigningUp)(SignUpComponent))
)
