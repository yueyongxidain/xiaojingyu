import * as React from 'react'
import { withRouter } from 'react-router-dom'
import './style.less'
import * as _ from 'lodash'
import { AllMenu } from 'setting/global/menu'

class AppLayout extends React.Component<any, any> {
  componentDidMount = () => {
    const selectedMenuKey = this.props.location.pathname
    if (selectedMenuKey == '/') {
      this.props.history.push(AllMenu[0].key)
    }
  }
  render() {
    const selectedMenuKey = this.props.location.pathname
    return (
      <div className="app">
        <div className="app-content">
          <div className="app-menu-0">
            <div className="app-menu-0-top">
              {AllMenu.map((ele) => {
                const selected = selectedMenuKey === ele.key
                return (
                  <div
                    key={ele.key}
                    className={`app-menu-item ${
                      selected ? 'app-menu-item-selected' : ''
                    }`}
                    onClick={() => this.menuSelect(ele.key)}
                  >
                    {ele.name}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="app-body">{this.props.children}</div>
          <div className="app-footer">Supremind © 2021</div>
        </div>
      </div>
    )
  }
  menuSelect = (key: string) => {
    this.props.history.push(key)
  }
}
export default withRouter(AppLayout)
