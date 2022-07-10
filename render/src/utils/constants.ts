export enum USER_LEVEL {
  SOLDIERANT = 0,
  WORKERANT = 1,
  FATHERANT = 2,
  KINGANT = 3
}
export const USER_LEVEL_NAME: { [type: number]: string } = {
  0: '兵蚁',
  1: '工蚁',
  2: '父蚁',
  3: '蚁王'
}
export const USER_LEVEL_THRESHOLD: { [type: number]: number } = {
  0: 100 * 1024 * 1024 * 1024,
  1: 500 * 1024 * 1024 * 1024,
  2: 1000 * 1024 * 1024 * 1024
}

export enum TASK_STAGE {
  UPLOAD = 0,
  DOWNLOAD = 1,
  DELETE = 2,
  PREDATA = 3
}

export const TASK_STAGE_NAME: { [type: number]: string } = {
  0: '上传',
  1: '下载',
  2: '删除',
  3: '预处理'
}

export enum TASK_STATUS {
  WATING = 0,
  PLAY = 1,
  PAUSED = 2,
  FINISH = 3,
  ERROR = 4,
  GETJSON = 5,
  METACHEKING = 6
}

export const TASK_STATUS_NAME: { [type: number]: string } = {
  0: '等待中',
  1: '进行中',
  2: '暂停中',
  3: '核算中',
  4: '已错误',
  5: 'json文件拉取中...',
  6: '媒体文件检查中...'
}
export enum TASK_SELECT_STATUS {
  UPLOADING = 0,
  UPLOADED = 1,
  UPLOADFAIL = 2,
  DOWNLOADING = 3,
  DOWNLOADED = 4,
  DOWNLOADFAIL = 5,
  PAUSED = 6
}

export const TASK_SELECT_STATUS_NAME: { [type: number]: string } = {
  0: '上传中',
  1: '上传完成',
  2: '上传失败',
  3: '下载中',
  4: '下载完成',
  5: '下载失败',
  6: '已暂停'
}
export enum TASK_SOURCE {
  VISIONMIND = 0,
  LOCAL = 1
}
export const TASK_SOURCE_NAME = {
  0: 'VisionMind',
  1: '本地'
}
export enum ORE_TYPES {
  FILES = 0,
  EVENT = 1,
  ILLEGAL = 2,
  DISCARD = 3,
  MISS = 4
}

export enum TASK_DATA_TYPE {
  ALL = '0',
  IMAGE = '1',
  VIDEO = '2'
}

export const ORE_TYPE_NAME: { [type: number]: string } = {
  0: '文件',
  1: '预警',
  2: '正检',
  3: '作废',
  4: '漏检'
}

export const ORE_TYPE_COLOR: { [type: number]: string } = {
  0: '#42C8A6',
  1: '#F08832',
  2: '#E45252',
  3: '#525EE4',
  4: '#2F8DF6'
}
export enum DELETE_OPTIONS {
  RECORD = 0,
  WITHFILE = 1,
  ALWAYSASK = 2
}
export const DELETE_OPTIONS_NAME = {
  0: '仅删除记录',
  1: '删除文件',
  2: '总是询问'
}
export const FILEFIELD = {
  0: [
    'snapshot.featureUri',
    'snapshot.snapshotUri',
    'snapshot.snapshotUriRaw',
    'snapshot.snapshotUriThumb'
  ],
  1: ['videoUri']
}

export const EVENT = {
  eventId: 'eventId',
  id: 'id',
  createdAt: 'createdAt'
}

export const EXPORTEVENT = {
  date: 'date',
  createdTime: 'createdTime',
  createdDate: 'createdDate'
}

export enum FILETYPE {
  IMAGE,
  VIDEO,
  EXTRA
}
export const FILETYPENAME = {
  0: '图片',
  1: '视频',
  2: '拓展文件'
}

export const duration = 1500
export const packhorse = 'https://apiserver.packhorse.qt.supremind.info'
export const doc =
  'https://cf.supremind.info/pages/viewpage.action?pageId=39106580'
export const atwork = 'https://atwork.stg.op.sl.supremind.info'
export const hodor = 'https://hodor.atom.sl.supremind.info'
export const appyaml =
  'https://atwork.op.qt.supremind.info/api/supreant_proxy/supremindNetDist_app.yml'
export const GITLAB_ACCESS_TOKEN =
  'https://git.supremind.info/profile/personal_access_tokens'
export const event_export =
  'https://cf.supremind.info/pages/viewpage.action?pageId=26445188'
