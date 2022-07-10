import * as React from 'react'
import './style.less'
import { TASK_SELECT_STATUS, TASK_SOURCE } from 'utils/constants'
import * as _ from 'lodash'
import { INewTask } from 'utils/store'
import { remote } from 'utils/ipc'

interface IState {
  selectedTaskKeys: string[]
  dataSource: INewTask[]
  loading: boolean
  uploadVisible: boolean
  downloadVisible: boolean
  detailVisible: boolean
  deleteVisible: boolean
  uploadPercent: Map<string, number>
  downloadPercent: Map<string, number>
  filterStatus: TASK_SELECT_STATUS
  filterSource: TASK_SOURCE
  curTask: INewTask
}

class Task extends React.PureComponent<any, IState> {
  state = {
    selectedTaskKeys: [],
    dataSource: [],
    loading: false,
    uploadVisible: false,
    downloadVisible: false,
    detailVisible: false,
    deleteVisible: false,
    uploadPercent: new Map(),
    downloadPercent: new Map(),
    filterStatus: undefined,
    filterSource: undefined,
    curTask: undefined
  }
  subscribe = undefined

  componentDidMount = () => {}
  render() {
    const LOG_PATH =
      remote.process.platform === 'darwin'
        ? `${remote.app.getPath('home')}/Library/Logs/supre_ant/main.log`
        : `${remote.app.getPath(
            'home'
          )}\\AppData\\Roaming\\supre_ant\\logs\\main.log`
    return (
      <div>
        <div>系统日志</div>
        <pre>{LOG_PATH}</pre>
      </div>
    )
  }
}
export default Task
