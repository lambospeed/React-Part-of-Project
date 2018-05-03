import { api } from 'api'

import {
  Action,
  GetMapSettings,
  SignUp,
  SignIn,
  dispatcher,
  asReq,
  asRes,
  asErr,
} from 'actions/action'

export { Action }

export const resetMessages = (): Action => ({ type: 'RESET_MESSAGES', })

export const signOutUser = (): Action => ({ type: 'SIGN_OUT', })

export const getMapSettings = dispatcher(api.getMapSettings)<GetMapSettings>(
  asReq('GET_MAP_SETTINGS_REQUEST'),
  asRes('GET_MAP_SETTINGS_SUCCESS'),
  asErr('GET_MAP_SETTINGS_ERROR')
)

export const signUpUser = dispatcher(api.signUp)<SignUp>(
  asReq('SIGN_UP_REQUEST'),
  asRes('SIGN_UP_SUCCESS'),
  asErr('SIGN_UP_ERROR')
)

export const signInUser = dispatcher(api.signIn)<SignIn>(
  asReq('SIGN_IN_REQUEST'),
  asRes('SIGN_IN_SUCCESS'),
  asErr('SIGN_IN_ERROR')
)
