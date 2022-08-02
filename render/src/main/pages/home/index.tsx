import * as React from "react";
import "./style.less";
import * as _ from "lodash";
import * as echarts from "echarts";
import wgs, { translate } from "utils/wgs";
import { isUndefined } from "lodash";
import keydown, { Keys } from 'react-keydown';
// import Circle from 'zrender/lib/graphic/shape/Circle'
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
    console.log(curPosition)
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
            B
          </div>
          <div className="line-b" id="line-b">
            c

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
          start: 0,
          end: 5,
          maxValueSpan: 20,
          minValueSpan: 8
        }
      ],
      toolbox: {
        feature: {
          myTool1: {
            show: true,
            title: '画笔',
            icon: 'path://M358.681,586.386s-90.968,49.4-94.488,126.827c-3.519,77.428-77.427,133.74-102.063,140.778s360.157,22.971,332.002-142.444l-135.45-125.16zM527.78,638.946c14.016,13.601,17.565,32.675,7.929,42.606-9.635,9.93-28.81,6.954-42.823-6.647l-92.767-88.518c-14.015-13.6-17.565-32.675-7.929-42.605,9.636-9.93,28.81-6.955,42.824,6.646l92.766,88.518zM849.514,173.863c-25.144-17.055-47.741-1.763-57.477,3.805-29.097,19.485-237.243,221.77-327.69,315.194-11.105,14.8-18.59,26.294,34.663,79.546,44.95,44.95,65.896,42.012,88.66,22.603,37.906-37.906,199.299-262.926,258.92-348.713,9.792-14.092,29.851-54.17,2.924-72.435z',
            onclick: this.onClickPencil
          },
          myTool2: {
            show: true,
            title: '打点',

            icon: 'path://M506.88,0C746.94656,0,941.7728,189.70624,942.08,424.1408c0,109.34272-43.4176,214.3232-121.0368,293.41696l-6.5536,6.51264L506.88,1024,199.2704,724.0704C120.36096,647.3728,71.68,541.3888,71.68,424.16128,71.68,189.70624,266.50624,0,506.88,0z,m0,153.6C351.35488,153.6,225.28,279.67488,225.28,435.2S351.35488,716.8,506.88,716.8,788.48,590.72512,788.48,435.2,662.40512,153.6,506.88,153.6z,m0,117.76a163.84,163.84,0,1,1,0,327.68,163.84,163.84,0,0,1,0-327.68z',
            onclick: this.onClickDot
          }
        }
      },
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
      console.log(data.end - data.start)
      console.log('lineChartA')
      this.lineChartB.dispatchAction({
        type: 'dataZoom',
        start: data.start,
        end: data.end
      })
    });
    this.lineChartA.on('selectchanged', (params) => {
      console.log('lineChartA')
      console.log(params)
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
      console.log('lineChartB')
      console.log(params)
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
      console.log('lineChartB')
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
    console.log(minY, maxY)
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
      console.log(data)
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
    if (this.state.mode === 'pencil') {
      this.pencilTmp.push(this.lastPoint)
    } else {
      const data = this.lineChartA.convertFromPixel('grid', [x, y]);
      const index = data[0]
      const value: number = data[1]
      this.dataArray[index] = +value.toFixed(2)
      let lastPosition
      let nextPosition
      for (let i = 0; i < index; i++) {
        if (!!this.dataArray[i]) {
          lastPosition = { x: i, y: this.dataArray[i] }
        }
      }
      for (let i = index + 1; i < this.state.dataSource.length; i++) {
        if (!!this.dataArray[i]) {
          nextPosition = { x: i, y: this.dataArray[i] }
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
    }
    this.lineChartA.setOption({
      series: [
        {
          // 根据名字对应到相应的系列
          name: "深度-1",
          data: this.dataArray
        }
      ]
    });
    this.drawPencil(x, y, 5);
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
      } else {
        this.drawLine(this.lastPoint.x, this.lastPoint.y, newPoint.x, newPoint.y);
      }
      this.zender.remove(this.pencile)
      this.drawPencil(x, y, 5)
      this.lastPoint = newPoint;

    }
  };

  onmouseup = () => {
    this.painting = false;
    this.zender?.remove(this.pencile)
    if (this.state.mode === 'pencil') {
      // 清除line
      this.pencilLine.forEach(line => {
        this.zender.remove(line)
      })
      if (this.pencilTmp.length > 0) {
        // 补划线
        this.pencilTmp.forEach(position => {
          const data = this.lineChartA.convertFromPixel('grid', [position.x, position.y]);
          const index = data[0]
          const value: number = data[1]
          this.dataArray[index] = +value.toFixed(2)
        })
        // 计算增加和减少
        const addDataSource = []
        const delDataSource = []
        const dataSource = []
        this.state.dataSource.forEach((item, index) => {
        console.log( index,this.dataArray,this.dataArray[index],!_.isUndefined(this.dataArray[index]))

          const value = +item.split(",")[3]
          if (!_.isUndefined(this.dataArray[index])) {
           if(this.dataArray[index] > value) {
            addDataSource.push(this.dataArray[index] - value)
            delDataSource.push(0)
            dataSource.push(value)
           }else{
            dataSource.push(this.dataArray[index])
            addDataSource.push(0)
            delDataSource.push(value - this.dataArray[index])
           }
          }else{
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

      // 清除缓存
      this.pencilLine = []
      this.pencilTmp = []
    }
  }

  // 画点函数

  drawPencil = (x, y, radius) => {
    console.log(x, y, path)
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
  onClickPencil = () => {
    this.setState({
      mode: this.state.mode === 'pencil' ? undefined : 'pencil'
    })
  }

  // 点击画笔
  onClickDot = () => {
    this.setState({
      mode: this.state.mode === 'dot' ? undefined : 'dot'
    })
  }
}
export default Home;
