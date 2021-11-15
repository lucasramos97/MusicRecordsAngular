export interface Login {
  email: string,
  password: string
}

export interface Authenticable {
  token: string,
  username: string,
  email: string
}

export interface User extends Login {
  username: string
}