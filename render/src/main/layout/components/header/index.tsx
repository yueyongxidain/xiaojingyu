import { IUser } from 'main/global/api'
import * as React from 'react'
import { USER_LEVEL, USER_LEVEL_NAME } from 'utils/constants'

import './style.less'
const famousRemark = [
  '数据是新科学，大数据能hold住一切答案',
  '如果我们有数据, 就让数据来发声',
  '数据本身是无用的，除非你从中获取到有价值的洞察',
  '没有大数据，你就是在高速公路上的瞎子或聋子',
  '针对过去，揭示规律，面对未来，预测趋势',
  '揭示数据之间的关系、模型、趋势，为决策者提供新的知识',
  '从数据中找到有用的真相，然后解释给领导者',
  '让数据讲故事，并且把故事讲给别人听',
  '用数据来做产品、提出新见解'
]
const random = Math.ceil(Math.random() * 8)
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
    const { user, popoverVisible } = this.state
    const isOnline = !!user?.fullname || !!user?.username
    const level = USER_LEVEL.SOLDIERANT
    const Icon = require(`../../../../../assets/level_${level + 1}.svg`)
    const KingIcon = require(`../../../../../assets/king.svg`)
    return (
      <div className="app-header">
        <div></div>
        <div className="app-header-right">
          <div className="app-famousRemark">{famousRemark[random]}</div>
          <div className="app-user">
            {isOnline && (
              <div
              >
                <div className={`app-user-icon app-user-iocn-online`}></div>
                <span className="app-user-name">
                  {user?.fullname || user?.username}
                </span>
              </div>
            )}
            {!isOnline && (
                <div className={`app-user-icon app-user-iocn-offline`}></div>
            )}
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
          {/* <div className="app-help" title="帮助"></div> */}
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
