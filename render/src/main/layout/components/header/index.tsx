import { IUser } from 'main/global/api'
import * as React from 'react'

import './style.less'

class AppHeader extends React.Component<
  any,
  {
    user: IUser
    popoverVisible: boolean
  }
> {
  state = { user: undefined, popoverVisible: false }
  popoverRef = React.createRef<HTMLDivElement>()
  componentDidMount() {
    // 1.获取用户信息
  }

  render() {
    return (
      <div className="app-header">
        <div></div>
        <div className="app-header-right">
         <div ><span>当前光标位置:</span> <span>X:</span> <span>Y:</span> <span>深度:</span><span>定位精度:</span></div>
        </div>
      </div>
    )
  }
}
export default AppHeader
