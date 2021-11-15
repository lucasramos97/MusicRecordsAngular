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

export interface Music {
  id: number,
  title: string,
  artist: string,
  release_date: string,
  duration: string,
  number_views: number,
  feat: boolean
}

export interface PagedMusics {
  content: Music[],
  total: number
}