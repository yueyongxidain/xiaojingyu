import * as React from 'react'
import { openBrowerTo } from 'utils'
import './style.less'
import { atwork, doc, event_export } from 'utils/constants'
import * as _ from 'lodash'

class Task extends React.PureComponent<any, any> {
  render() {
    return (
      <div className="home">
        <div className="home-title">精彩指南</div>
        <div className="home-card">
          <div className="home-card-supreAnt" onClick={() => openBrowerTo(doc)}>
            <div className="home-card-supreAnt-logo"></div>
            <div className="home-card-supreAnt-desc">
              <p>闪马超蚁 是一个基于 Electron 技术的采集工具可视化客户端</p>
              <p>
                可视化页面，对于用户使用毫无障碍，会用百度网盘就会用闪马超蚁
              </p>
              <p>
                在windows 系统下再也不需要另外安装cwrsync操作，mac
                由于没有证书，仍然需要提前安装rsync 3.0。
              </p>
            </div>
          </div>
          <div className="home-card-right">
            <div
              className="home-card-atwork"
              onClick={() => openBrowerTo(atwork)}
            >
              <div className="home-card-atwork-logo"></div>
              <div className="home-card-atwork-desc">
                atwork 是提供业务运营、数据运营 的基础平台
              </div>
            </div>
            <div
              className="home-card-event_export"
              onClick={() => openBrowerTo(event_export)}
            >
              <div className="home-card-event_export-logo"></div>
              <div className="home-card-event_export-desc">
                命令行 是提供在无界面操作系统中采集工具
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Task
