export interface User {
  id: number
  firstName: string
  lastName: string
  createAt: string
  keys: number
  room: number
  earnings: number
  loss: number
  useRofls: boolean
}

export interface UserCreatePromise {
  data: User | null
  error: Error | null
}
export interface UserFindPromise extends UserCreatePromise {}
export interface UserUpdatePromise extends UserCreatePromise {}
