import * as React from 'react'
import './style.less'
import * as _ from 'lodash'
import AppHeader from './components/header'
import Home from 'main/pages/home'

class AppLayout extends React.Component<any, any> {
  render() {
    return (
      <div className="app">
        <AppHeader />
        <div className="app-content">
          <Home/>
        </div>
      </div>
    )
  }
}
export default AppLayout
