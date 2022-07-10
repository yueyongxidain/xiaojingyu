import { logOut } from 'utils'
import { intercept } from '../../utils/fetch'
import store from '../../utils/store'
// import { getProjects, getDataTypes } from './api'
const bootstrap = async () => {
  if (store.get('offline')) {
    return
  }
  try {
    intercept({
      onResponse: (res) => {
        if (res.status === 401) {
          // 关闭主窗口
          logOut()
        }
        return res
      }
    })
    // if (store.get('userInfo.idtoken')) {
    //   // 查询所有的客户以及项目
    //   const allProjectRes = await getProjects()
    //   // 查询所有的数据类型
    //   const allDataTypeRes = await getDataTypes()
    //   store.set('allProject', allProjectRes.data.items)
    //   store.set('allDataType', allDataTypeRes.data.items)
    //   // 检查上传和下载
    // }
  } catch (err) {
    console.log(err.message)
  }
}
export { bootstrap }
