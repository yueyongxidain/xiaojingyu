import { isEmpty } from 'lodash'
import { IUser } from 'main/global/api'
import * as React from 'react'
import { USER_LEVEL, USER_LEVEL_NAME } from 'utils/constants'
import {
  getUser,
  ipcRenderer,
  logOutUser,
  showLoginWindow,
  showSettingWindow
} from 'utils/ipc'
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
    this.loadUser()
    // 2.注册ipc
    ipcRenderer.on('update_user', (event, arg) => {
      // 更新用户信息
      this.setState({
        user: arg.user
      })
    })
  }
  loadUser = async () => {
    try {
      const { data: user } = await getUser()
      this.setState({
        user
      })
    } catch (e) {
      // TODO 记录日志
      this.setState({
        user: undefined
      })
      console.log(e)
    }
  }
  login = () => {
    const { user } = this.state
    if (!isEmpty(user)) {
      return
    }
    showLoginWindow()
  }
  logOut = async () => {
    // 1. 发送消息登出
    await logOutUser()
    this.showUserPopover(false)
  }
  setting = () => {
    showSettingWindow()
  }
  showUserPopover = (value) => {
    this.setState(
      {
        popoverVisible: !!value
      },
      () => {
        if (this.state.popoverVisible && this.popoverRef) {
          this.popoverRef.current.focus()
        }
      }
    )
  }
  render() {
    const { user, popoverVisible } = this.state
    const isOnline = !!user?.fullname || !!user?.username
    const level = USER_LEVEL.SOLDIERANT
    const Icon = require(`../../../../../assets/level_${level + 1}.svg`)
    const KingIcon = require(`../../../../../assets/king.svg`)
    return (
      <div className="app-header">
        <div></div>
        <div className="app-header-right">
          <div className="app-user">
            {isOnline && (
              <div
                className="app-user-header"
                onClick={() => this.showUserPopover(true)}
              >
                <div className={`app-user-icon app-user-iocn-online`}></div>
                <span className="app-user-name">
                  {user?.fullname || user?.username}
                </span>
              </div>
            )}
            {!isOnline && (
              <div className="app-user-header" onClick={this.login}>
                <div className={`app-user-icon app-user-iocn-offline`}></div>
                <span className="app-user-sign">点击登陆</span>
              </div>
            )}
            {popoverVisible && (
              <div
                ref={this.popoverRef}
                className="app-user-popover"
                tabIndex={-1}
                onBlur={() => this.showUserPopover(false)}
              >
                <div className="app-user-popover-userinfo">
                  <div className="app-user-popover-userinfo-icon"></div>
                  <div className="app-user-popover-action">
                    <div>{user?.fullname}</div>
                    <div
                      className="app-user-popover-action-logOut"
                      onClick={this.logOut}
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
                  <div className="app-user-popover-workload-num">
                    <div className="app-user-popover-workload-num-progress">
                      <span></span>
                      本月
                    </div>
                    <div className="app-user-popover-workload-num-data">
                      已上传 1GB,已下载 1GB
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="app-help" title="帮助"></div>
          <div
            className="app-setting"
            title="设置"
            onClick={this.setting}
          ></div>
        </div>
      </div>
    )
  }
}
export default AppHeader
