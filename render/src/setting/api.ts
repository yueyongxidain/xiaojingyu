import { atwork, hodor } from 'utils/constants'
import { apiFetchGet, IResponse } from 'utils/fetch'
export async function login(params): Promise<any> {
  return apiFetchGet(`${atwork}/api/hodor/verify`, params)
}
export async function getIdtoken(header): Promise<IResponse<void>> {
  return apiFetchGet(`${hodor}/login/gitlab`, undefined, header)
}
export interface IUser {
  idToken: string
  email: string
  fullname: string
  username: string
}
