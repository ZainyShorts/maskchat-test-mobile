export interface User {
  id?: number
  name: string
  first_name: string
  last_name: string
  email: string
  user_type?: number
  password?: string
  country?: string
  city?: string
  address?: string
  mobile?: string
  verifyPassword?: string
  status: string
  createdAt?: string
  postalCode?: string | undefined
  deleted?: boolean
  isLoggedIn?: boolean
  isChecked: boolean
}

export interface RegisterUserType {
  id?: number
  name: string
  first_name: string
  last_name: string
  email: string
  user_type?: number
  password?: string
  country: string
  city: string
  address: string
  mobile: string
  verifyPassword?: string
  status: string
  createdAt?: string
  postalCode?: string | undefined
  deleted?: boolean
  isLoggedIn?: boolean
  isChecked: boolean
}

export interface LoginUser {
  email: string
  password?: string
}

export interface verifyUserType {
  email: string
  code: number
}

export interface forgotPasswordUserType {
  email: string
  code?: number
}

export interface resetPasswordUserType {
  new_password: number
  confirm_password?: number
}

export interface updateUserPasswordData {
  old_password: number
  new_password: number
  confirm_password?: number
}

export interface UserFromLocalStorage {
  createdAt: string
  deleted: boolean
  email: string
  first_name: string
  id: number
  isLoggedIn: boolean
  last_name: string
  postalCode: string
  status: string
  user_type: string
}
