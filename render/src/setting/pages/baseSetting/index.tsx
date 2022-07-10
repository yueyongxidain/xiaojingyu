import * as React from 'react'
import './style.less'
import * as _ from 'lodash'
import { getFileName, openFileDirectoryWindow, showErrorMessage } from 'utils'
import { getConfig, setConfig } from 'utils/ipc'

interface IState {
  downloadPath: string
  downloadJobMaxNumber: number
  downloadRetry: number
  uploadJobMaxNumber: number
  notification: boolean
}

class Task extends React.PureComponent<any, IState> {
  state = {
    downloadPath: undefined,
    downloadJobMaxNumber: undefined,
    downloadRetry: undefined,
    uploadJobMaxNumber: undefined,
    notification: false
  }
  subscribe = undefined

  componentDidMount = async () => {
    const config: any = await getConfig()
    this.setState({
      downloadPath: config.data.downloadPath,
      downloadJobMaxNumber: config.data.downloadJobMaxNumber,
      downloadRetry: config.data.downloadRetry,
      uploadJobMaxNumber: config.data.uploadJobMaxNumber,
      notification: config.data.notification
    })
  }
  selecFilePath = async () => {
    try {
      const filePath = await openFileDirectoryWindow()
      if (!!filePath) {
        this.setState({
          downloadPath: filePath[0]
        })
      }
    } catch (e) {
      showErrorMessage(e.message)
    }
  }
  onChangeDownloadRetry = (e) => {
    this.setState({
      downloadRetry: e.currentTarget.value * 1
    })
  }
  onChangeUploadJobMaxNumber = (e) => {
    this.setState({
      uploadJobMaxNumber: e.currentTarget.value * 1
    })
  }
  onChangeDownloadJobMaxNumber = (e) => {
    this.setState({
      downloadJobMaxNumber: e.currentTarget.value * 1
    })
  }
  onClickSubmit = async () => {
    // TODO 处理保存设置
    const params = {
      downloadPath: this.state.downloadPath,
      downloadJobMaxNumber: this.state.downloadJobMaxNumber,
      downloadRetry: this.state.downloadRetry,
      uploadJobMaxNumber: this.state.uploadJobMaxNumber,
      notification: this.state.notification
    }
    await setConfig(params)
  }
  onClickReset = async () => {
    // TODO 处理重置
    const config: any = await getConfig()
    this.setState({
      downloadPath: config.data.downloadPath,
      downloadJobMaxNumber: config.data.downloadJobMaxNumber,
      downloadRetry: config.data.downloadRetry,
      uploadJobMaxNumber: config.data.uploadJobMaxNumber
    })
  }
  onChangeNotification = (notification) => {
    this.setState({
      notification
    })
  }
  render() {
    return (
      <div className="baseSetting">
        <div>
          <span className="label">下载位置:</span>
          <span>
            <span className="downloadPath" title={this.state.downloadPath}>
              {getFileName(this.state.downloadPath)}
            </span>
            <button onClick={this.selecFilePath}>浏览</button>
          </span>
        </div>
        <div>
          <span className="label">下载重试次数:</span>
          <span>
            <select
              placeholder="下载重试次数"
              className="selecter"
              value={this.state.downloadRetry?.toString()}
              onChange={this.onChangeDownloadRetry}
            >
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </span>
        </div>
        <div>
          <span className="label">最大上传任务数:</span>
          <span>
            <select
              placeholder="最大上传任务数"
              className="selecter"
              value={this.state.uploadJobMaxNumber?.toString()}
              onChange={this.onChangeUploadJobMaxNumber}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </span>
        </div>
        <div>
          <span className="label">最大上传任务数:</span>
          <span>
            <select
              placeholder="最大上传任务数"
              className="selecter"
              value={this.state.downloadJobMaxNumber?.toString()}
              onChange={this.onChangeDownloadJobMaxNumber}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </span>
        </div>
        <div>
          <span className="label">是否通知:</span>
          <span>
            <input
              type="radio"
              checked={!!this.state.notification}
              onChange={() => this.onChangeNotification(true)}
            />
            是
            <input
              type="radio"
              checked={!this.state.notification}
              onChange={() => this.onChangeNotification(false)}
            />
            否
          </span>
        </div>
        <div className="baseSetting-action">
          <button
            className="baseSetting-action-submit"
            onClick={this.onClickSubmit}
          >
            保存
          </button>
          <button
            className="baseSetting-action-cancle"
            onClick={this.onClickReset}
          >
            重置
          </button>
        </div>
      </div>
    )
  }
}
export default Task
