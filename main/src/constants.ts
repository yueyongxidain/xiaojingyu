export enum TASK_TYPE {
  WATING = 0,
  PLAY = 1,
  PAUSED = 2,
  FINISH = 3,
  ERROR = 4,
  GETJSON = 5,
  METACHEKING = 6
}
export enum TASK_SOURCE {
  VISIONMIND = 0,
  LOCAL = 1
}
export enum ORE_TYPES {
  FILES = 0,
  EVENT = 1,
  ILLEGAL = 2,
  DISCARD = 3,
  MISS = 4
}
export enum ACTION_TYPE {
  UPLOAD = 0,
  DOWNLOAD = 1,
  DELETE = 2,
  PREDATA = 3
}
export enum MimeType {
  OTHER = 0,
  IMAGE,
  VIDEO,
  JSON,
  TMP
}
export const DISCARD_REASON: { [type: number]: string } = {
  0: '其他',
  221: '其他',
  229: '测试正确',
  201: '检测错误',
  202: '判断错误',
  211: '取证问题',
  212: '无人脸信息',
  121: '其他',
  129: '测试正确',
  101: '检测错误',
  104: '大车问题',
  114: '夜晚问题',
  113: '白名单车',
  102: '判断错误',
  103: '跟踪错误',
  112: '车牌模糊'
}
export enum DOWNLOADMOD {
  DEFAULT,
  PLUGIN
}
export enum DELETE_OPTIONS {
  RECORD = 0,
  WITHFILE = 1,
  ALWAYSASK = 2
}

export enum TASK_DATA_TYPE {
  ALL = '0',
  IMAGE = '1',
  VIDEO = '2'
}

export enum EXIT_CODE {
  ERROR = 1,
  RSYNC_20 = 20, // https://bobcares.com/blog/rsync-error-code-20/
  // https://lxadm.com/Rsync_exit_codes
  RSYNC_10 = 10, // Error in socket I/O
  RSYNC_12 = 12, // Error in rsync protocol data stream
  RSYNC_30 = 30 // Timeout in data send/receive
}

export enum UPLOAD_CLIENT {
  WEB = 1,
  SUPREANT = 2,
  CLI = 3
}
