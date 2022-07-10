import { apiFetchPost } from './fetch'

export async function updatePackhorseJob(params) {
  return apiFetchPost(`${global.config.PACKHORSE}/v1/job/upload/update`, params)
}

export async function updateAtworkMine(params) {
  return apiFetchPost(`${global.config.ATWORK}/api/mine`, params)
}
export async function createPackhorseJob(params) {
  return apiFetchPost(`${global.config.PACKHORSE}/v1/job/upload/create`, params)
}
export async function createUpload(params) {
  return apiFetchPost(`${global.config.ATWORK}/api/uploads`, params)
}
