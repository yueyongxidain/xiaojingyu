import * as React from "react";
import "./style.less";
import * as _ from "lodash";
import * as echarts from "echarts";
import wgs, { translate } from "utils/wgs";
import { isUndefined } from "lodash";
class Home extends React.PureComponent<any, any> {
  private lineChartA;
  private lineChartB;
  private scatterChartA
  state = {
    lineChartASelectedIndex: 0,
    lineChartBSelectedIndex: 0,
    dataSource:[]
  }
  componentDidMount(): void {
    window.electronAPI.onPositions((_event, value) => {
      this.setState({
        dataSource:value
      },()=>{
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
    const curPosition = this.state.dataSource.length>0?this.state.dataSource[this.state.lineChartASelectedIndex].split(','):undefined
    console.log(curPosition)
    return (
      <div className="home">
        <div className="position">
          <div className="desc">
            <p>当前光标位置:</p> <p>X: {curPosition&&curPosition[1]}</p> <p>Y:{curPosition&&curPosition[2]}</p> <p>深度:</p><p>定位精度:</p>
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
          end: 5
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
          data: positions.map((position) => position.split(",")[3]),
          selectedMode: "single"
        },
      ],
    });
    this.lineChartA.on('datazoom', ({ batch }) => {
      if (!batch) {
        return
      }
      const data = batch[0]
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
      const { seriesIndex, dataIndex } = data
      if (+dataIndex === +this.state.lineChartASelectedIndex) {
        return
      }
      this.setState({
        lineChartASelectedIndex: dataIndex
      }, () => {
        this.lineChartB.dispatchAction({
          type: 'select',
          seriesIndex,
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
          end: 5
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
      series: [
        {
          symbolSize: 2,
          data: dataY,
          type: 'scatter'
        }
      ]
    })

  }
}
export default Home;
