import * as React from 'react'
import './style.less'
import * as _ from 'lodash'
import Home from 'main/pages/home'

class AppLayout extends React.Component<any, any> {
  render() {
    return (
      <div className="app">
        <Home />
      </div>
    )
  }
}
export default AppLayout
