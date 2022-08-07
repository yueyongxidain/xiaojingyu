import * as React from 'react'
import { Route} from 'react-router-dom'
import AppLayout from './layout/index'
import './style.less'
class App extends React.Component {
  // 不刷新路由
  mergeRouer = (item, parentKey) => {
    if (!item) {
      return
    }
    if (item.children) {
      return item.children.map((ele) =>
        this.mergeRouer(ele, parentKey + item.key)
      )
    } else {
      return (
        <Route
          key={parentKey + item.key}
          path={parentKey + item.key + '(/*)'}
          component={item.component}
        ></Route>
      )
    }
  }
  render() {
    return (
      <AppLayout>
      </AppLayout>
    )
  }
}

export default App
