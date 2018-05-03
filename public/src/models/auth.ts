export type Credentials = {
  firstName: string,
  lastName: string,
  email: string,
  username: string,
}

export type SignUpData = {
  credentials: Credentials,
  password: string,
  confirmPassword: string
}

export type SignInData = {
  email: string,
  password: string,
  rememberMe: boolean
}
