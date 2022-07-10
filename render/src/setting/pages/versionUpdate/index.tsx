import * as React from 'react'
import './style.less'
import * as _ from 'lodash'
import { getUpdateInfo, notUpdate, remote, update } from 'utils/ipc'

interface IState {
  latestVersion: string
  latestReleaseNotes: string[]
  latestForce: Boolean
  isLatest: boolean
}

class Task extends React.PureComponent<any, IState> {
  state = {
    isLatest: false,
    latestVersion: undefined,
    latestForce: false,
    latestReleaseNotes: []
  }
  subscribe = undefined

  componentDidMount = () => {
    const search = new URLSearchParams(this.props.history.location.search)
    if (search.get('version')) {
      this.setState({
        latestVersion: search.get('version'),
        latestReleaseNotes: search.get('releaseNotes').split(','),
        latestForce: search.get('force') === 'true'
      })
    }
  }
  loadUpdateInfo = async () => {
    // TODO 加载版本信息
    const versionInfo: any = await getUpdateInfo()
    this.setState({
      latestVersion: versionInfo.version,
      latestReleaseNotes: versionInfo.releaseNotes || [],
      latestForce: versionInfo.force
    })
  }
  onClickNotUpdate = async () => {
    // TODO 点击不更新
    if (this.state.latestForce) {
      return
    } else {
      // 1. 将当前页面的信息清空
      this.setState({
        latestForce: false,
        latestVersion: undefined,
        latestReleaseNotes: []
      })
      // 2. 发送终止检查的信息
      await notUpdate()
    }
  }
  onClickUpdate = async () => {
    // 2. 发送终止检查的信息
    await update()
  }
  render() {
    return (
      <div className="versionUpdate">
        <div className="versionUpdate-info">
          <div className="versionUpdate-logo"></div>
          {this.state.latestVersion && (
            <div>
              <p>您目前使用的是{remote.app.getVersion()}版本</p>
              <p>检测到新版本：{this.state.latestVersion}</p>
            </div>
          )}
          {!this.state.latestVersion && (
            <div className="versionUpdate-desc">
              {this.state.isLatest && <p>您目前使用的已经是最新版本</p>}
              <p>当前版本：{remote.app.getVersion()}</p>
            </div>
          )}
        </div>
        {this.state.latestVersion && this.state.latestReleaseNotes && (
          <div>
            更新说明:
            <div className="versionUpdate-releaseNote">
              {this.state.latestReleaseNotes.map((ele, index) => (
                <p key={index}>
                  {index + 1}、{ele}
                </p>
              ))}
            </div>
          </div>
        )}
        <div className="versionUpdate-action">
          {!this.state.isLatest && !this.state.latestVersion && (
            <button
              className="versionUpdate-action-submit"
              onClick={this.loadUpdateInfo}
            >
              检查更新
            </button>
          )}
          {this.state.latestVersion && (
            <button
              className="versionUpdate-action-submit"
              onClick={this.onClickUpdate}
            >
              立即更新
            </button>
          )}
          {this.state.latestVersion && !this.state.latestForce && (
            <button
              className="versionUpdate-action-cancle"
              onClick={this.onClickNotUpdate}
            >
              知道了
            </button>
          )}
        </div>
      </div>
    )
  }
}
export default Task
