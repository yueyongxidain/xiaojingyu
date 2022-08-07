import { IUser } from 'main/global/api'
import * as React from 'react'
import { USER_LEVEL, USER_LEVEL_NAME } from 'utils/constants'
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
  
  }
  render() {
    const { user, popoverVisible } = this.state
    const level = USER_LEVEL.SOLDIERANT
    const Icon = require(`../../../../../assets/level_${level + 1}.svg`)
    const KingIcon = require(`../../../../../assets/king.svg`)
    return (
      <div className="app-header">
        <div></div>
        <div className="app-header-right">
          <div className="app-user">
            {popoverVisible && (
              <div
                ref={this.popoverRef}
                className="app-user-popover"
                tabIndex={-1}
              >
                <div className="app-user-popover-userinfo">
                  <div className="app-user-popover-userinfo-icon"></div>
                  <div className="app-user-popover-action">
                    <div>{user?.fullname}</div>
                    <div
                      className="app-user-popover-action-logOut"
                    >
                      退出登陆
                    </div>
                  </div>
                </div>
                <div className="app-user-popover-workload">
                  <div className="app-user-popover-workload-level">
                    <img
                      src={KingIcon}
                      className="app-user-popover-workload-king-icon"
                    ></img>
                    <div className="app-user-popover-workload-level-name">
                      {USER_LEVEL_NAME[level]}
                    </div>
                    <img
                      src={Icon}
                      className="app-user-popover-workload-level-icon"
                    ></img>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="app-help" title="帮助"></div>
          <div
            className="app-setting"
            title="设置"
          ></div>
        </div>
      </div>
    )
  }
}
export default AppHeader
