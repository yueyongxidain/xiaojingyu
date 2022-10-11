import * as React from 'react'
import './style.less'
import * as _ from 'lodash'
interface IState {
  interval: 3 | 5 | 6 | 8
  mime: 'CSV' | 'TXT'
  gpsStatus: 1 | 2 | 3 | 4 | 5 | 6
  loading: boolean
  downloadPath: string
}
class AppLayout extends React.Component<any, IState> {
  state: IState = {
    interval: 3,
    mime: 'CSV',
    gpsStatus: 1,
    loading: false,
    downloadPath: ''
  }
  constructor(props) {
    super(props)
  }
  componentDidMount(): void {
    window.electronAPI.finishExport((_event, value) => {
      setTimeout(() => {
        this.setState({
          loading: false
        })
      }, 500)
    })
    window.electronAPI.getDownloadPath({})
    window.electronAPI.downloadPath((_event, value) => {
      this.setState({
        downloadPath: value.downloadPath
      })
    })
    window.electronAPI.errorExport((_event, value) => {
      setTimeout(() => {
        this.setState({
          loading: false
        })
      }, 500)
    })
  }
  render() {
    return (
      <div className="app">
        <div className="app-content">
          <div className="app-body">
            <div className="item">
              <span className="label">下载路径：</span>
              <span className="field">
                <div className="downloadPath">{this.state.downloadPath}</div>
                <button onClick={() => window.electronAPI.showSaveAs()}>
                  {' '}
                  选择路径
                </button>
              </span>
            </div>
            <div className="item">
              <span className="label">文件格式：</span>
              <span>
                <input
                  type="radio"
                  value="CSV"
                  checked={this.state.mime === 'CSV'}
                  onChange={this.onChangeMime}
                />
                {' CSV '}
                <input
                  type="radio"
                  value="TXT"
                  checked={this.state.mime === 'TXT'}
                  onChange={this.onChangeMime}
                />
                {' TXT '}
              </span>
            </div>
            <div className="item">
              <span className="label">数据坐标格式：</span>
              <span>ddd,mm,ss.sss</span>
            </div>
            <div className="item">
              <span className="label">仅在GPS状态下有效：</span>
              <span>
                <select
                  placeholder="GPS状态"
                  className="selecter"
                  value={this.state.gpsStatus.toString()}
                  onChange={this.onChangeGpsStatus}
                >
                  <option value="0">全部</option>
                  <option value="1">单点定位</option>
                  <option value="2">差分定位</option>
                  <option value="3">无效PPS</option>
                  <option value="4">实时差分定位</option>
                  <option value="5">RTK FLOAT</option>
                </select>
              </span>
            </div>
            <div className="item">
              <span className="label">采样间距：</span>
              <span>
                <select
                  placeholder="采样间距"
                  className="selecter"
                  value={this.state.interval.toString()}
                  onChange={this.onChangeInterval}
                >
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                </select>
              </span>
            </div>
            <div className="submit">
              <button onClick={this.onSubmit} disabled={this.state.loading}>
                导出{this.state.loading ? '中...' : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  onChangeMime = (e) => {
    this.setState({
      mime: e.currentTarget.value
    })
  }

  onChangeGpsStatus = (e) => {
    this.setState({
      gpsStatus: +e.currentTarget.value as any
    })
  }

  onChangeInterval = (e) => {
    this.setState({
      interval: +e.currentTarget.value as any
    })
  }

  onSubmit = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        // 主进程发送消息
        window.electronAPI.export({
          interval: this.state.interval,
          mime: this.state.mime,
          gpsStatus: this.state.gpsStatus
        })
      }
    )
  }
}
export default AppLayout
