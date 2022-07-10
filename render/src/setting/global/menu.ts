import * as React from 'react'
import * as Loadable from 'react-loadable'
interface IPage {
  key: string
  name: string
  icon?: string
  disabled?: boolean
  hidden?: boolean
  component?: any
}
interface IMenu {
  key: string
  name: string
  children?: IPage[]
  icon?: string
  disabled?: boolean
  component?: any
}
const dynamicWrapper = (component) => {
  if (component.toString().indexOf('.then(') < 0) {
    return (props) => {
      return React.createElement(component().default, {
        ...props
      })
    }
  }
  return Loadable({
    loader: () => {
      return component().then((raw) => {
        const Component = raw.default || raw
        return (props) =>
          React.createElement(Component, {
            ...props
          })
      })
    },
    loading: ({ error, pastDelay }) => {
      if (pastDelay) {
        return React.createElement('div', {
          size: 'large'
        })
      } else {
        return null
      }
    }
  })
}

export const AllMenu: IMenu[] = [
  {
    key: '/baseSetting',
    name: '基本设置',
    component: dynamicWrapper(() => import('../pages/baseSetting'))
  },
  {
    key: '/versionUpdate',
    name: '检查更新',
    component: dynamicWrapper(() => import('../pages/versionUpdate'))
  },
  {
    key: '/logFiles',
    name: '日志文件',
    component: dynamicWrapper(() => import('../pages/logFiles'))
  }
]
