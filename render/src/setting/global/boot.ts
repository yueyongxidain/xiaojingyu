import { intercept } from '../../utils/fetch'
const bootstrap = async () => {
  try {
    intercept({
      onResponse: (res) => {
        if (res.status === 401) {
          // 关闭主窗口
        }
        return res
      }
    })
  } catch (err) {
    console.log(err.message)
  }
}
export { bootstrap }
