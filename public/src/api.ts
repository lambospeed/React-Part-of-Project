import * as JWT from 'jwt-decode'
import { Credentials, SignInData, SignUpData } from 'models/auth'
import { MapSettings } from 'models/map'

const BASE_URL: string = 'http://localhost:9000/app'

type AuthResponse = {
  token: string,
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  role: string
}

function AuthSuccess(data: AuthResponse): Credentials {
  // Set the token in local storage
  localStorage.setItem('id_token', data.token)
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    email: data.email
  }
}

function AsyncCall<T, B, U, V>(
  data: T,
  getBody: (data: T) => B,
  postSuccess: (res: U) => V,
  endpoint: string,
  method: string,
  headers: Headers
): Promise<V> {
  let config = { method: method, headers: headers, body: JSON.stringify(getBody(data)) }
  return new Promise((resolve, reject) => fetch(`${BASE_URL}/${endpoint}`, config).then(
    response => response.json().then((resObj: U) => ({ resObj, response }))
  ).then(({ resObj, response }) =>  {
    if (!response.ok) {
      console.log("Error in get map settings")
      console.error(response);
      console.error(resObj);
      return reject(resObj)
    } else {
      // If successful, run postSuccess
      console.log("ok = ", response)
      console.log("ok Obj = ", resObj)
      return resolve(postSuccess(resObj))
    }
  }).catch(e => reject(e)))
}

export function GetSignUpBody(data: SignUpData): Object {
  return {
    'email': data.credentials.email,
    'username': data.credentials.username,
    'password': data.password,
    'confirmPassword': data.confirmPassword,
    'firstName': data.credentials.firstName,
    'lastName': data.credentials.lastName
  }
}

export type Api = {
  signUp(x: SignUpData): Promise<Credentials>,
  signIn(x: SignInData): Promise<Credentials>,
  getMapSettings(): Promise<MapSettings>
}

function AuthorizeUserCall<T, B>(
  data: T,
  getBody: (data: T) => B,
  endpoint: string
): Promise<Credentials> {
  return AsyncCall(data, getBody, AuthSuccess, endpoint, "POST", COMMON_HEADERS)
}

function GetCall<U, V>(
  endpoint: string,
  postSuccess: (res: U) => V
): Promise<V> {
  return AsyncCall(
    {},  (() => {}), postSuccess, endpoint, "GET", GetAuthHeaders()
  )
}

export function GetCall0<U>(endpoint: string): Promise<U> {
  return GetCall(endpoint, ((res: U) => res))
}

export const api: Api = {
  signUp: (data: SignUpData): Promise<Credentials> => AuthorizeUserCall(
    data, GetSignUpBody, "signUp"
  ),
  signIn: (data: SignInData): Promise<Credentials> => AuthorizeUserCall(
    data, () => data, "signIn"
  ),
  getMapSettings: (): Promise<MapSettings> => GetCall0("mapSettings")
}

function GetCookie(name: string): string | undefined {
  let value: string = "; " + document.cookie;
  let parts: Array<string> = value.split("; " + name + "=");
  if (parts.length == 2) {
    let cookies: string | undefined = parts.pop()
    if (cookies) { return cookies.split(";").shift() } else { return undefined }
  } else { return undefined }
}

const COMMON_HEADERS: Headers = new Headers({
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Csrf-Token': GetCookie('AURITA_CSRF_TOKEN') || ""
})

export function GetAuthHeaders(): Headers {
  let headers: Headers = COMMON_HEADERS
  headers.append('X-Auth-Token', localStorage.getItem('id_token') || "")
  return headers
}

export function IsSignedIn(): boolean {
  let token: string | null = localStorage.getItem('id_token')
  if (token) {
    try {
      let decoded: Object = JWT(token)
      if (decoded["exp"] && ((decoded["exp"] * 1000) > new Date().getTime())) {
        return true
      } else {
        DeleteToken()
        return false
      }
    } catch(e) {
      console.error(`Decode JWT error: ${token}`)
      console.error(e)
      DeleteToken()
      return false
    }
  } else { return false }
}

export function DeleteToken() {
  localStorage.removeItem('id_token')
  return
}
