import { combineReducers } from 'redux'
import { Action } from 'actions'
import { Credentials } from 'models/auth'
import { MapSettings } from 'models/map'

export type All = {
  authError: string,
  credentials: Credentials,
  error: string,
  gettingMapSettings: boolean,
  isSigningIn: boolean,
  isSigningUp: boolean,
  isSigningOut: boolean,
  mapSettings: MapSettings,
  message: string
}

function isSigningUp (state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case 'SIGN_UP_REQUEST':
      return true
    case 'SIGN_UP_SUCCESS':
    case 'SIGN_UP_ERROR':
      return false
    default:
      return state
  }
}

function isSigningOut(state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case 'SIGN_OUT':
      return true
    default:
      return state
  }
}

function isSigningIn(state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case 'SIGN_IN_REQUEST':
      return true
    case 'SIGN_IN_SUCCESS':
    case 'SIGN_IN_ERROR':
      return false
    default:
      return state
  }
}

function gettingMapSettings(state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case 'GET_MAP_SETTINGS_REQUEST':
      return true
    case 'GET_MAP_SETTINGS_SUCCESS':
    case 'GET_MAP_SETTINGS_ERROR':
      return false
    default:
      return state
  }
}

function authError (state: string = '', action: Action): string {
  switch (action.type) {
    case 'SIGN_UP_REQUEST':
    case 'SIGN_IN_REQUEST':
    case 'RESET_MESSAGES':
      return ''
    case 'SIGN_UP_ERROR':
    case 'SIGN_IN_ERROR':
      console.log("error = ", action)
      return action.error
    default:
      return state
  }
}

function error (state: string = '', action: Action): string {
  switch (action.type) {
    case 'GET_MAP_SETTINGS_REQUEST':
    case 'RESET_MESSAGES':
      return ''
    case 'GET_MAP_SETTINGS_ERROR':
      console.log("map error = ", action)
      return action.error
    default:
      return state
  }
}

function message (state: string = '', action: Action): string {
  switch (action.type) {
    case 'SIGN_UP_SUCCESS':
      return 'We have sent a verification link to your email address.'
    case 'RESET_MESSAGES':
      return ''
    default:
      return state
  }
}

const credentialsState: Credentials = {
  firstName: "Visitor",
  lastName: "",
  email: "",
  username: "visitor",
}

function credentials (
  state: Credentials = credentialsState, action: Action
): Credentials {
  switch (action.type) {
    case 'SIGN_UP_SUCCESS':
    case 'SIGN_IN_SUCCESS':
      return {
        firstName: action.response.firstName,
        lastName: action.response.lastName,
        username: action.response.username,
        email: action.response.email,
      }
    case 'SIGN_OUT':
      return credentialsState
    default:
      return state
  }
}

function mapSettings (
  state: MapSettings | null = null, action: Action
): MapSettings | null {
  switch (action.type) {
    case 'GET_MAP_SETTINGS_SUCCESS':
      return action.response
    case 'SIGN_OUT':
      return null
    default:
      return state
  }
}

const reducers = combineReducers<All>({
  authError,
  credentials,
  mapSettings,
  error,
  gettingMapSettings,
  isSigningIn,
  isSigningOut,
  isSigningUp,
  message
})

export default reducers
