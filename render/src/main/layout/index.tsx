import * as React from 'react'
import { BottomMenu, TopMenu } from '../global/menu'
import { withRouter } from 'react-router-dom'
import './style.less'
import * as _ from 'lodash'
import AppHeader from './components/header'

class AppLayout extends React.Component<any, any> {
  render() {
    const selectedMenuKey = this.props.location.pathname || BottomMenu[0].key
    return (
      <div className="app">
        <AppHeader />
        <div className="app-content">
          <div className="app-menu-0">
            <div className="app-menu-0-top">
              {TopMenu.map((ele) => {
                const selected = selectedMenuKey === ele.key
                const Icon = require(`../../../assets/${ele.icon}${
                  selected ? '_selected' : ''
                }.svg`)
                return (
                  <div
                    key={ele.key}
                    className={`app-menu-item ${
                      selected ? 'app-menu-item-selected' : ''
                    }`}
                    onClick={() => this.menuSelect(ele.key)}
                  >
                    <img src={Icon} className="app-menu-item-icon"></img>
                    {ele.name}
                  </div>
                )
              })}
            </div>
            <div className="app-menu-0-bottom">
              {BottomMenu.map((ele) => {
                const selected = selectedMenuKey === ele.key
                const Icon = require(`../../../assets/${ele.icon}${
                  selected ? '_selected' : ''
                }.svg`)
                return (
                  <div
                    key={ele.key}
                    className={`app-menu-item ${
                      selected ? 'app-menu-item-selected' : ''
                    }`}
                    onClick={() => this.menuSelect(ele.key)}
                  >
                    <img src={Icon} className="app-menu-item-icon"></img>
                    {ele.name}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="app-body">{this.props.children}</div>
        </div>
      </div>
    )
  }
  menuSelect = (key: string) => {
    this.props.history.push(key)
  }
}
export default withRouter(AppLayout)
