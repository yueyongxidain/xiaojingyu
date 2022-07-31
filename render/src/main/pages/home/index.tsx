import * as React from "react";
import "./style.less";
import * as _ from "lodash";
import * as echarts from "echarts";
import wgs, { translate } from "utils/wgs";
import { isUndefined } from "lodash";
import keydown, { Keys } from 'react-keydown';
import Circle from 'zrender/lib/graphic/shape/Circle'
import Line from 'zrender/lib/graphic/shape/Line'

const { RIGHT, LEFT } = Keys

class Home extends React.PureComponent<any, any> {
  private lineChartA;
  private lineChartB;
  private scatterChartA
  private painting = false;
  private zender
  private dataArray = new Array(0)
  private lastPoint = { x: undefined, y: undefined };
  state = {
    lineChartASelectedIndex: 0,
    lineChartBSelectedIndex: 0,
    scatterChartAelectedIndex: 0,
    dataSource: []
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
                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: this.onmouseup
            },
            myTool2: {
                show: true,
                title: '自定义扩展方法',
                icon: 'image://https://echarts.apache.org/zh/images/favicon.png',
                onclick: this.onmouseup
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
          data: positions.map((position) => position.split(",")[3]),
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

  onmousedown = ({ event }) => {
    if(!this.painting){
      return
    }
   
    let x = event.zrX;
    let y = event.zrY;
    this.lastPoint = { "x": x, "y": y };
    const data = this.lineChartA.convertFromPixel('grid', [x, y]);
    const index = data[0]
    const value: number = data[1]
    this.dataArray[index] = +value.toFixed(2)
    let lastPosition
    let nextPosition
    for (let i = 0; i < index; i++) {
      console.log('last：', this.dataArray[i])
      if (!!this.dataArray[i]) {
        lastPosition = { x: i, y: this.dataArray[i] }
      }
    }
    for (let i = index + 1; i < this.state.dataSource.length; i++) {
      console.log('next:', this.dataArray[i])
      if (!!this.dataArray[i]) {
        nextPosition = { x: i, y: this.dataArray[i] }
      }
    }
    //填补数据
    if (lastPosition) {
      for (let i = lastPosition.x + 1; i < index; i++) {
        this.dataArray[i] = value - ( ((index - i)/(index - lastPosition.x))*(value-lastPosition.y))
        console.log('add: ',i, ' ',this.dataArray[i])
      }
    }
    if (nextPosition) {
      for (let i = index + 1; i <= nextPosition.x; i++) {
        this.dataArray[i] = value - ( ((index - i)/(index - nextPosition.x))*(value-nextPosition.y))
      }
    }
    console.log(lastPosition, nextPosition, index)
    this.lineChartA.setOption({
      series: [
        {
          // 根据名字对应到相应的系列
          name: "深度-1",
          data: this.dataArray
        }
      ]
    });
    console.log(data)
    this.drawCircle(x, y, 5);
  };

  onmousemove = ({ event }) => {
    if (this.painting) {
      let x = event.zrX;
      let y = event.zrY;
      let newPoint = { "x": x, "y": y };
      this.drawLine(this.lastPoint.x, this.lastPoint.y, newPoint.x, newPoint.y);
      this.lastPoint = newPoint;
    }
  };

  onmouseup = () => {
    this.painting = false;
  }
  // 画点函数
  drawCircle = (x, y, radius) => {
    console.log(x, y)
    var circle = new Circle({
      shape: {
        cx: x,
        cy: y,
        r: radius
      },
      style: {
        fill: 'none',
        stroke: '#F00'
      }
    });
    this.zender.add(circle);
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
    this.zender.add(line);
  }
}
export default Home;
