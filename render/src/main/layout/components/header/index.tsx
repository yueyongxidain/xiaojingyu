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
       
        </div>
      </div>
    )
  }
}
export default AppHeader
