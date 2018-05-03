import { Credentials, SignInData, SignUpData } from 'models/auth'
import { MapSettings } from 'models/map'

type Q<T> = { request: T }
type S<T> = { response: T }
type E = { error: string }

type ThunkAction<TQ, TS, TE, _Q, _S> = ({ type: TQ } & Q<_Q>)
  | ({ type: TS } & Q<_Q> & S<_S>)
  | ({ type: TE } & Q<_Q> & E)

export type SignUp = ThunkAction<
  'SIGN_UP_REQUEST',
  'SIGN_UP_SUCCESS',
  'SIGN_UP_ERROR',
  SignUpData,
  Credentials
>

export type SignIn = ThunkAction<
  'SIGN_IN_REQUEST',
  'SIGN_IN_SUCCESS',
  'SIGN_IN_ERROR',
  SignInData,
  Credentials
>

export type GetMapSettings = ThunkAction<
  'GET_MAP_SETTINGS_REQUEST',
  'GET_MAP_SETTINGS_SUCCESS',
  'GET_MAP_SETTINGS_ERROR',
  {},
  MapSettings
>

export type Action = GetMapSettings |
  SignUp |
  SignIn |
  { type: 'SIGN_OUT' } |
  { type: 'RESET_MESSAGES' }

type _T = Action['type']

// TypeScript won't narrow a `ThunkAction` union directly, but
// we can help it out by tagging the three permutations.
export const asReq = <TQ extends _T>(type: TQ) =>
  <_Q>(request: _Q) => ({ type, request })

export const asRes = <TS extends _T>(type: TS) =>
  <_Q, _S>(request: _Q, response: _S) => ({ type, request, response })

export const asErr = <TE extends _T>(type: TE) =>
  <_Q>(request: _Q, error: string) => ({ type, request, error })

type Dispatch<A> = (a: A) => A
type Thunk<Q, S> = (request: Q) => Promise<S>

type ReqCreator<A, _Q> = (q: _Q) => A
type ResCreator<A, _Q, _S> = (q: _Q, s: _S) => A
type ErrCreator<A, _Q> = (q: _Q, e: string) => A

export const dispatcher = <_Q, _S>(fn: Thunk<_Q, _S>) => <A extends Action>(
  tq: ReqCreator<A, _Q>, ts: ResCreator<A, _Q, _S>, te: ErrCreator<A, _Q>
) => (request: _Q) => (dispatch: Dispatch<A>) => {
  dispatch(tq(request))
  fn(request)
    .then(response => dispatch(ts(request, response)) )
    .catch(err => dispatch(te(request, err.error)))
}
