import * as React from "react";
import "./style.less";
import * as _ from "lodash";
import * as echarts from "echarts";
class Home extends React.PureComponent<any, any> {
  private lineChartA;
  private lineChartB;
  componentDidMount(): void {
    window.electronAPI.onPositions((_event, value) => {
      console.log(value);
      this.renderLineChartA(value);
      this.renderLineChartB(value);
    });
    this.lineChartA = echarts.init(document.getElementById("line-a"));
    this.lineChartB = echarts.init(document.getElementById("line-b"));
  }
  render() {
    return (
      <div className="home">
        <div className="position">A</div>
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
      xAxis: {
        data: positions.map((position) => position.split(",")[0]),
        position: "top",
      },
      yAxis: {
        position: "right",
        inverse: true,
        boundaryGap: false,
        alignTicks: true,
      },

      axisPointer: {
        show: true,
      },
      series: [
        {
          name: "销量",
          type: "bar",
          data: positions.map((position) => position.split(",")[3]),
        },
      ],
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

      axisPointer: {
        show: true,
      },
      series: [
        {
          name: "销量",
          type: 'line',
          data: positions.map((position) => -1 * position.split(",")[3]),
        },
      ],
    });
  }
}
export default Home;
