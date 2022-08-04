import * as React from "react";
import "./style.less";
import * as _ from "lodash";
import * as echarts from "echarts";
import wgs, { translate } from "utils/wgs";
import { isUndefined } from "lodash";
import keydown, { Keys } from 'react-keydown';
import Line from 'zrender/lib/graphic/shape/Line'
import Path from 'zrender/lib/graphic/Path'
import * as path from 'zrender/lib/tool/path'

const { RIGHT, LEFT } = Keys
interface IState {
  lineChartASelectedIndex: number,
  lineChartBSelectedIndex: number,
  scatterChartAelectedIndex: number,
  dataSource: number[],
  mode: 'pencil' | 'dot'
}
class Home extends React.PureComponent<any, IState> {
  private lineChartA;
  private lineChartB;
  private scatterChartA
  private painting = false;
  private zender
  private dataArray = new Array(0)
  private pencile
  private lastPoint = { x: undefined, y: undefined };
  private pencilTmp = []
  private pencilLine = []
  private history = []
  private historyIndex = 0
  private startPoint
  private endPoint
  state = {
    lineChartASelectedIndex: 0,
    lineChartBSelectedIndex: 0,
    scatterChartAelectedIndex: 0,
    dataSource: [],
    mode: undefined
  }
  componentDidMount(): void {
    window.electronAPI.onPositions((_event, value) => {
      this.setState({
        dataSource: value
      }, () => {
        this.renderLineChartA(value);
        this.renderLineChartB(value);
        this.renderScatterChartA(value)
      })
    });
    this.lineChartA = echarts.init(document.getElementById("line-a"));
    this.lineChartB = echarts.init(document.getElementById("line-b"));
    this.scatterChartA = echarts.init(document.getElementById("scatter-a"));
  }
  render() {
    const curPosition = this.state.dataSource.length > 0 ? this.state.dataSource[this.state.lineChartASelectedIndex].split(',') : undefined
    return (
      <div className="home">
        <div className="position">
          <div className="desc">
            <p>当前光标位置:</p> <p>X: {curPosition && curPosition[1]}</p> <p>Y:{curPosition && curPosition[2]}</p> <p>深度:</p><p>定位精度:</p>
          </div>
          <div className="scatter-a" id="scatter-a">
            c
          </div>
        </div>
        <div className="line">
          <div className="line-a" id="line-a">
          </div>
          <div className="line-b" id="line-b">
            c
          </div>
          <div className="toolbox">
            <span onClick={this.onClickPencil}>

              <svg fill={this.state.mode === 'pencil' ? "#1296db" : ''} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5997" width="28" height="28"><path d="M358.681 586.386s-90.968 49.4-94.488 126.827c-3.519 77.428-77.427 133.74-102.063 140.778s360.157 22.971 332.002-142.444l-135.45-125.16z m169.099 52.56c14.016 13.601 17.565 32.675 7.929 42.606-9.635 9.93-28.81 6.954-42.823-6.647l-92.767-88.518c-14.015-13.6-17.565-32.675-7.929-42.605 9.636-9.93 28.81-6.955 42.824 6.646l92.766 88.518z m321.734-465.083c-25.144-17.055-47.741-1.763-57.477 3.805-29.097 19.485-237.243 221.77-327.69 315.194-11.105 14.8-18.59 26.294 34.663 79.546 44.95 44.95 65.896 42.012 88.66 22.603 37.906-37.906 199.299-262.926 258.92-348.713 9.792-14.092 29.851-54.17 2.924-72.435z" p-id="5998"></path></svg>
            </span>
            <span onClick={this.onClickRestore}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7012" width="28" height="28"><path d="M567.342545 101.888c-67.537455 0-134.516364 16.802909-193.768727 48.546909a34.955636 34.955636 0 0 0 33.047273 61.579636 341.178182 341.178182 0 0 1 160.768-40.261818c187.624727 0 340.293818 152.622545 340.293818 340.293818s-152.622545 340.293818-340.293818 340.293819c-163.095273 0-299.613091-115.386182-332.567273-268.706909l46.545455 46.545454a34.816 34.816 0 0 0 49.338182 0 34.909091 34.909091 0 0 0 0-49.384727l-112.314182-112.314182a35.979636 35.979636 0 0 0-49.384728 0L56.785455 580.747636a34.909091 34.909091 0 1 0 49.384727 49.384728l56.273454-56.32c29.975273 196.840727 199.866182 348.299636 404.945455 348.299636 226.117818 0 410.065455-183.994182 410.065454-410.112 0-226.117818-183.947636-410.112-410.112-410.112z" p-id="7013"></path></svg>
            </span>
            <span onClick={this.onClickPre}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7872" width="28" height="28"><path d="M967.111111 967.111111h-113.777778v-113.777778c0-221.866667-176.355556-398.222222-398.222222-398.222222H113.777778V341.333333h341.333333c284.444444 0 512 227.555556 512 512v113.777778z" fill="#0D1733" p-id="7873"></path><path d="M409.6 762.311111L51.2 398.222222 409.6 39.822222l85.333333 79.644445-284.444444 278.755555 284.444444 284.444445z" p-id="7874"></path></svg>
            </span>
            <span onClick={this.onClickNext}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9188" width="28" height="28"><path d="M170.666667 967.111111H56.888889v-113.777778c0-284.444444 227.555556-512 512-512h341.333333v113.777778h-341.333333c-221.866667 0-398.222222 176.355556-398.222222 398.222222v113.777778z" fill="#0D1733" p-id="9189"></path><path d="M614.4 762.311111L529.066667 682.666667l284.444444-284.444445-284.444444-278.755555L614.4 39.822222 972.8 398.222222z" p-id="9190"></path></svg>
            </span>
          </div>
        </div>
      </div>
    );
  }

  private renderLineChartA(positions) {
    this.lineChartA.setOption({
      title: {
        text: null,
      },
      tooltip: {},
      dataZoom: [
        {
          id: 'dataZoomX',
          type: "inside",
          xAxisIndex: [0],
          filterMode: 'empty',
          startValue: 0,
          endValue: 20,
          zoomOnMouseWheel: 'ctrl',
          moveOnMouseMove: 'shift',
        }
      ],
      xAxis: {
        data: positions.map((position) => position.split(",")[0]),
        position: "top",
        boundaryGap: ['20%', '20%'],
        splitLine: {
          show: false
        }
      },
      yAxis: {
        position: "right",
        inverse: true,
        boundaryGap: false,
        alignTicks: true,
        splitLine: {
          show: false
        }
      },

      axisPointer: {
        show: true,
      },

      series: [
        {
          name: "深度",
          type: "bar",
          stack: 'A',
          data: positions.map((position) => position.split(",")[3]),
          selectedMode: "single"
        },
        {
          name: "增加",
          type: "bar",
          stack: 'A',
          itemStyle: {
            color: 'green'
          },
          selectedMode: "single"
        },
        {
          name: "缩减",
          type: "bar",
          stack: 'A',
          itemStyle: {
            color: '#969596a8'
          },
          selectedMode: "single"
        },
        {
          name: "深度-1",
          type: "line",
          selectedMode: "single"
        }
      ],
    });
    this.zender = this.lineChartA.getZr()
    this.zender.on('mousedown', this.onmousedown)
    this.zender.on('mousemove', this.onmousemove)
    this.zender.on('mouseup', this.onmouseup)

    this.lineChartA.on('datazoom', ({ batch }) => {
      if (!batch) {
        return
      }
      const data = batch[0]
      this.lineChartB.dispatchAction({
        type: 'dataZoom',
        start: data.start,
        end: data.end
      })
    });
    this.lineChartA.on('selectchanged', (params) => {
      const { selected } = params
      const data = selected[0]
      if (!selected) {
        return
      }
      const { dataIndex } = data
      if (+dataIndex === +this.state.lineChartASelectedIndex) {
        return
      }
      this.setState({
        lineChartASelectedIndex: dataIndex
      }, () => {
        this.lineChartB.dispatchAction({
          type: 'select',
          dataIndex
        })
        this.scatterChartA.dispatchAction({
          type: 'select',
          dataIndex
        })
      })

    });

  }

  private renderLineChartB(positions) {
    this.lineChartB.setOption({
      title: {
        text: null,
      },
      tooltip: {},
      xAxis: {
        data: positions.map((position) => position.split(",")[0]),
        position: "top",
      },
      yAxis: {
        type: 'value',
        inverse: false,
        boundaryGap: false,
      },
      dataZoom: [
        {
          id: 'dataZoomX',
          type: "inside",
          xAxisIndex: [0],
          filterMode: 'empty',
          start: 0,
          end: 5,
          maxValueSpan: 20,
          minValueSpan: 8
        }
      ],
      axisPointer: {
        show: true,
      },
      series: [
        {
          name: "高度",
          type: 'line',
          data: positions.map((position) => -1 * position.split(",")[3]),
          selectedMode: "single",

          select: {
            disabled: false,
            itemStyle: {
              color: "rgba(252, 6, 6, 1)",
              borderColor: "rgba(40, 177, 13, 1)",
              borderDashOffset: 17,
              borderJoin: "round",
              shadowBlur: 5.5,
              borderWidth: 12
            }
          }
        },
      ],
    });
    this.lineChartB.on('selectchanged', (params) => {
      const { selected } = params
      const data = selected[0]
      if (!selected) {
        return
      }
      const { seriesIndex, dataIndex } = data
      if (+dataIndex === +this.state.lineChartBSelectedIndex) {
        return
      }
      this.setState({
        lineChartBSelectedIndex: data.dataIndex
      }, () => {
        this.lineChartA?.dispatchAction({
          type: 'select',
          seriesIndex,
          dataIndex

        })
      })
    })
    this.lineChartB.on('datazoom', ({ batch }) => {
      if (!batch) {
        return
      }
      const data = batch[0]
      this.lineChartA.dispatchAction({
        type: 'dataZoom',
        start: data.start,
        end: data.end
      })
    });
  }
  private renderScatterChartA(positions) {
    const dataX = []
    const dataY = []
    let minY
    let maxY
    positions.forEach(position => {
      const B = translate(position.split(",")[1])
      const L = translate(position.split(",")[2])
      const H = +position.split(",")[4]
      const res = wgs(B, L, H)
      dataX.push(res.X),
        dataY.push(res.Y)
      minY = isUndefined(minY) ? res.Y : minY > res.Y ? res.Y : minY
      maxY = isUndefined(maxY) ? res.Y : maxY < res.Y ? res.Y : maxY
    })
    this.scatterChartA.setOption({
      xAxis: {
        data: dataX
      },
      yAxis: {
        min: minY,
        max: maxY
      },
      dataZoom: [
        {
          id: 'dataZoomX',
          type: "inside",
          xAxisIndex: [0],
          filterMode: 'empty',
          start: 0,
          end: 5,
          maxValueSpan: 20,
          minValueSpan: 8
        }
      ],
      series: [
        {
          name: '定位',
          symbolSize: (value, params) => {
            console.log(value, params)
            return 2
          },
          data: dataY,
          type: 'scatter',
          selectedMode: "single",
          select: {
            disabled: false,
          }
        }
      ]
    })

    this.scatterChartA.on('selectchanged', (params) => {
      console.log('scatterChartA')
      console.log(params)
      const { selected } = params
      const data = selected[0]
      if (!selected) {
        return
      }
      const { dataIndex } = data
      if (+dataIndex === +this.state.scatterChartAelectedIndex) {
        return
      }
      this.setState({
        scatterChartAelectedIndex: dataIndex
      }, () => {
        this.lineChartB.dispatchAction({
          type: 'select',
          dataIndex
        })
        this.lineChartA.dispatchAction({
          type: 'select',
          dataIndex
        })
      })

    });

  }

  // 键盘事件
  @keydown(LEFT)
  renderlLast() {
    this.setState({
      lineChartASelectedIndex: Math.max(this.state.lineChartASelectedIndex - 1, 0),
      lineChartBSelectedIndex: Math.max(this.state.lineChartBSelectedIndex - 1, 0),
    }, () => {
      this.lineChartA.dispatchAction({
        type: 'select',
        dataIndex: this.state.lineChartASelectedIndex
      })
      this.lineChartB.dispatchAction({
        type: 'select',
        dataIndex: this.state.lineChartBSelectedIndex
      })
    })
  }

  @keydown(RIGHT)
  renderNext() {
    this.setState({
      lineChartASelectedIndex: Math.min(this.state.lineChartASelectedIndex + 1, this.state.dataSource.length),
      lineChartBSelectedIndex: Math.min(this.state.lineChartBSelectedIndex + 1, this.state.dataSource.length),
    }, () => {
      this.lineChartA.dispatchAction({
        type: 'select',
        dataIndex: this.state.lineChartASelectedIndex
      })
      this.lineChartB.dispatchAction({
        type: 'select',
        dataIndex: this.state.lineChartBSelectedIndex
      })
    })
  }

  // 鼠标事件
  onmousedown = ({ event }) => {
    if (!this.state.mode) {
      return
    }
    this.painting = true
    let x = event.zrX;
    let y = event.zrY;
    this.lastPoint = { "x": x, "y": y };
    this.startPoint = this.lastPoint
    if (this.state.mode === 'pencil') {
      this.pencilTmp.push(this.lastPoint)
      this.drawPencil(x, y, 5);
    }
  };

  onmousemove = ({ event }) => {
    if (!this.state.mode) {
      return
    }
    if (this.painting) {
      let x = event.zrX;
      let y = event.zrY;
      let newPoint = { "x": x, "y": y };
      if (this.state.mode === 'pencil') {
        this.pencilTmp.push(newPoint)
        this.drawLine(this.lastPoint.x, this.lastPoint.y, newPoint.x, newPoint.y);
        this.zender.remove(this.pencile)
        this.drawPencil(x, y, 5)
        this.lastPoint = newPoint;
      }
    }
  };

  onmouseup = () => {
    this.painting = false;
    this.endPoint = this.lastPoint
    this.zender?.remove(this.pencile)
    if (this.state.mode === 'pencil') {
      // 清除line
      this.pencilLine.forEach(line => {
        this.zender.remove(line)
      })
      if (this.pencilTmp.length > 0) {
        // 补划线
        this.computeDataArray()
        this.history.push({ pencilTmp: this.pencilTmp, startPoint: this.startPoint, endPoint: this.endPoint })
        this.historyIndex = this.history.length - 1
      }

      // 清除缓存
      this.clearCache()
    }
  }

  // 画点函数

  drawPencil = (x, y, radius) => {
    this.pencile = new Path(path.createFromString("M358.681 586.386s-90.968 49.4-94.488 126.827c-3.519 77.428-77.427 133.74-102.063 140.778s360.157 22.971 332.002-142.444l-135.45-125.16z m169.099 52.56c14.016 13.601 17.565 32.675 7.929 42.606-9.635 9.93-28.81 6.954-42.823-6.647l-92.767-88.518c-14.015-13.6-17.565-32.675-7.929-42.605 9.636-9.93 28.81-6.955 42.824 6.646l92.766 88.518z m321.734-465.083c-25.144-17.055-47.741-1.763-57.477 3.805-29.097 19.485-237.243 221.77-327.69 315.194-11.105 14.8-18.59 26.294 34.663 79.546 44.95 44.95 65.896 42.012 88.66 22.603 37.906-37.906 199.299-262.926 258.92-348.713 9.792-14.092 29.851-54.17 2.924-72.435z", {
      style: {
        fill: '#5AC2EE'
      },
    }));
    const rect = this.pencile.getBoundingRect()
    const m = rect.calculateTransform({ x: x - radius * 5, y: y - radius * 5, width: radius * 5, height: radius * 5 })
    this.pencile.setLocalTransform(m)
    this.zender.add(this.pencile);
  }

  drawLine = (x1, y1, x2, y2) => {
    const line = new Line({
      shape: {
        x1,
        x2,
        y1,
        y2
      },
      style: {
        lineWidth: 3
      }
    })
    this.pencilLine.push(line)
    this.zender.add(line);
  }

  // 点击画笔
  onClickPencil = (e) => {
    e.stopPropagation()
    this.setState({
      mode: this.state.mode === 'pencil' ? undefined : 'pencil'
    })
  }

  // 点击重置
  onClickRestore = () => {
    this.lineChartA.dispatchAction({
      type: 'restore'
    })
    this.lineChartB.dispatchAction({
      type: 'restore'
    })
    this.lastPoint = { x: undefined, y: undefined };
    this.clearCache()
    this.dataArray = []
    this.setState({
      mode: undefined
    })
  }

  // computeDataArray 计算数据
  computeDataArray = () => {
    this.pencilTmp.forEach(position => {
      const data = this.lineChartA.convertFromPixel('grid', [position.x, position.y]);
      const index = data[0]
      const startData = this.lineChartA.convertFromPixel('grid', [this.startPoint.x, this.startPoint.y]);
      const endData = this.lineChartA.convertFromPixel('grid', [this.endPoint.x, this.endPoint.y]);
      const startIndex = startData[0]
      const endIndex = endData[0]
      console.log(startIndex, endIndex)
      const value: number = data[1]
      this.dataArray[index] = +value.toFixed(2)
      let lastPosition
      let nextPosition
      for (let i = index - 1; i >= startIndex; i--) {
        if (!!this.dataArray[i]) {
          lastPosition = { x: i, y: this.dataArray[i] }
          break
        }
      }
      for (let i = index + 1; i <= endIndex; i++) {
        if (!!this.dataArray[i]) {
          nextPosition = { x: i, y: this.dataArray[i] }
          break
        }
      }
      //填补数据
      if (lastPosition) {
        for (let i = lastPosition.x + 1; i < index; i++) {
          this.dataArray[i] = value - (((index - i) / (index - lastPosition.x)) * (value - lastPosition.y))
        }
      }
      if (nextPosition) {
        for (let i = index + 1; i <= nextPosition.x; i++) {
          this.dataArray[i] = value - (((index - i) / (index - nextPosition.x)) * (value - nextPosition.y))
        }
      }
    })
    // 计算增加和减少
    const addDataSource = []
    const delDataSource = []
    const dataSource = []
    this.state.dataSource.forEach((item, index) => {
      const value = +item.split(",")[3]
      if (!_.isUndefined(this.dataArray[index])) {
        if (this.dataArray[index] > value) {
          addDataSource.push(this.dataArray[index] - value)
          delDataSource.push(0)
          dataSource.push(value)
        } else {
          dataSource.push(this.dataArray[index])
          addDataSource.push(0)
          delDataSource.push(value - this.dataArray[index])
        }
      } else {
        dataSource.push(value)
        addDataSource.push(0)
        delDataSource.push(0)
      }
    })
    this.lineChartA.setOption({
      series: [
        {
          name: "深度",
          data: dataSource,
        },
        {
          name: "增加",
          data: addDataSource,
        },
        {
          name: "缩减",
          data: delDataSource,
        },
        {
          name: "深度-1",
          data: this.dataArray,
        },
      ]
    });
  }

  onClickPre = () => {
    this.historyIndex -= 1
    this.clearDataArray(this.startPoint,this.endPoint)
    this.pencilTmp = this.history[this.historyIndex].pencilTmp
    this.startPoint= this.history[this.historyIndex].startPoint
    this.endPoint = this.history[this.historyIndex].endPoint
    this.computeDataArray()
  }


  onClickNext = () => {
    this.historyIndex += 1
    this.pencilTmp = this.history[this.historyIndex].pencilTmp
    this.startPoint= this.history[this.historyIndex].startPoint
    this.endPoint = this.history[this.historyIndex].endPoint
    console.log(this.pencilTmp)
    this.computeDataArray()
  }
  // 清除页面缓存
  clearCache() {
    this.pencilTmp = []
    this.pencilLine = []
  }

  clearDataArray  = (startPoint,endPoint)=>{
    const startData = this.lineChartA.convertFromPixel('grid', [startPoint.x, startPoint.y]);
    const endData = this.lineChartA.convertFromPixel('grid', [endPoint.x, endPoint.y]);
    const startIndex = startData[0]
    const endIndex = endData[0]
    for(let i = startIndex;i<= endIndex;i++){
      delete this.dataArray[i]
    }
  }
}
export default Home;
