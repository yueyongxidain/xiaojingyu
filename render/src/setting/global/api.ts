import { apiFetchGet, IResponse, IResponseCollection } from '../../utils/fetch'
import { appyaml, atwork } from '../../utils/constants'
export interface IProject {
  id: number
  code: string
  name: string
  customerName: string
  customer: ICustomer
  products: IProduct[]
  createdAt: string
  updatedAt: string
}

export interface ICustomer {
  id: number
  code: string
  name: string
  alias: string
  note: string
  province: string
  city: string
  county: string
  createdAt: string
  updatedAt: string
}

export interface IProduct {
  id: number
  code: string
  name: string
  alias: string
  note: string
  tags: string
  latestVersion: string
  createdAt: string
  updatedAt: string
}

export interface IDataType {
  id: number
  name: string
  volumes: string[]
  product: IProduct
  customer: ICustomer
  createdAt: string
  updatedAt: string
}
export interface IUser {
  idToken: string
  email: string
  fullname: string
  username: string
}
export async function getProjects(
  params = {}
): Promise<IResponse<IResponseCollection<IProject>>> {
  return apiFetchGet(`${atwork}/api/projects`, {
    ...params,
    current: 1,
    pageSize: Number.MAX_SAFE_INTEGER
  })
}
export async function getDataTypes(): Promise<
  IResponse<IResponseCollection<IDataType>>
> {
  return apiFetchGet(`${atwork}/api/data_types`)
}

export async function getProduct(): Promise<
  IResponse<IResponseCollection<IProduct>>
> {
  return apiFetchGet(`${atwork}/api/product`)
}

export function downloadVersionFile() {
  return apiFetchGet(appyaml)
}
