import * as React from "react";
import "./style.less";
import * as _ from "lodash";
import * as echarts from "echarts";
import wgs, { translate } from "utils/wgs";
import { isUndefined } from "lodash";
import Line from "zrender/lib/graphic/shape/Line";
import Path from "zrender/lib/graphic/Path";
import * as path from "zrender/lib/tool/path";
import * as Mousetrap from "mousetrap";

interface IState {
  lineChartASelectedIndex: number;
  lineChartBSelectedIndex: number;
  scatterChartAelectedIndex: number;
  mode: "pencil" | "delete" | "play" | "pause" | "move";
  historyIndex: number;
  startValue: number;
  endValue: number;
  dataArray: number[];
  dataSource: any[];
}
class Home extends React.PureComponent<any, IState> {
  private lineChartA;
  private lineChartB;
  private scatterChartA;
  private painting = false;
  private zender;

  private pencile;
  private lastPoint = { x: undefined, y: undefined };
  private pencilTmp = [];
  private pencilLine = [];
  private history = [];
  private startPoint;
  private endPoint;
  private originData;
  private playTimer;
  private image = new Image();
  constructor(props) {
    super(props);
    this.image.src =
      "data:image/png;base64,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";
  }
  state = {
    lineChartASelectedIndex: -1,
    lineChartBSelectedIndex: -1,
    scatterChartAelectedIndex: -1,
    dataArray: new Array(0),
    dataSource: [],
    mode: undefined,
    historyIndex: -1,
    startValue: 0,
    endValue: 30,
  };
  componentDidMount(): void {
    this.lineChartA = echarts.init(document.getElementById("line-a"));
    this.lineChartB = echarts.init(document.getElementById("line-b"));
    this.scatterChartA = echarts.init(document.getElementById("scatter-a"));
    Mousetrap.bind("left", this.renderlLast);
    Mousetrap.bind("right", this.renderNext);
    window.electronAPI.getReOpen();
    window.electronAPI.onPositions((_event, value) => {
      this.originData = [...value];
      this.setState(
        {
          dataSource: [...value],
        },
        () => {
          this.renderLineChartA(value);
          this.renderLineChartB(value);
          this.renderScatterChartA(value);
        }
      );
    });
    window.electronAPI.getDataSource((_event, value) => {
      window.electronAPI.sendDataSource({
        dataArray: this.state.dataArray,
        dataSource: this.state.dataSource,
      });
    });
    window.electronAPI.getHistory((_event, value) => {
      window.electronAPI.sendHistory({
        dataArray: this.state.dataArray,
        dataSource: this.state.dataSource,
        history: this.history,
      });
    });
    window.electronAPI.sendHistoryToRender((_event, value) => {
      const { lastDatarray, lastHostory, lastDataSource } = value;
      this.history = _.isEmpty(lastHostory) ? this.history : lastHostory;

      this.setState(
        {
          dataArray: _.isEmpty(lastDatarray)
            ? this.state.dataArray
            : lastDatarray,
          dataSource: _.isEmpty(lastDataSource)
            ? this.state.dataSource
            : lastDataSource,
          historyIndex: this.history.length - 1,
        },
        this.draw
      );
    });
  }

  render() {
    console.log(
      (this.state.endValue - this.state.startValue) /
        this.state.dataSource.length
    );
    const curPosition =
      this.state.dataSource.length > 0
        ? this.state.dataSource[this.state.lineChartASelectedIndex]?.split(",")
        : undefined;
    return (
      <>
        <div className="app-header">
          <div className="button_group">
            <div className="left_button" onClick={this.onClickPreFare}></div>
            {this.state.mode !== "play" && (
              <div className="play_button" onClick={this.onClickPlay}></div>
            )}
            {this.state.mode === "play" && (
              <div className="pause_button" onClick={this.onClickPause}></div>
            )}
            <div className="right_button" onClick={this.onClickNextFare}></div>
            <div
              className={
                this.state.mode === "move"
                  ? "move_button_selected"
                  : "move_button"
              }
              onClick={this.onClickMove}
            ></div>
            <input
              type="range"
              min={0}
              max={100}
              value={
                (this.state.endValue - this.state.startValue) /
                  this.state.dataSource.length || 0
              }
            />
            <div
              className={
                this.state.mode === "delete"
                  ? "del_button_selected"
                  : "del_button"
              }
              onClick={this.onClickDelete}
            ></div>
          </div>
          <div className="app-header-right"></div>
          <div className="toolbox">
            <div
              className={
                this.state.mode === "pencil" ? "pencil_selected" : "pencil"
              }
              onClick={this.onClickPencil}
            ></div>
            <div onClick={this.onClickRestore} className="restore"></div>
            <div onClick={this.onClickPre} className="pre_step"></div>
            <div onClick={this.onClickNext} className="next_step"></div>
          </div>
        </div>
        <div className="app-content">
          <div className="home">
            <div className="position">
              <div className="desc">
                <p>当前光标位置:</p> <p>X: {curPosition && curPosition[1]}</p>{" "}
                <p>Y:{curPosition && curPosition[2]}</p>{" "}
                <p>
                  深度: {curPosition && curPosition[3]} (
                  {this.state.dataArray[this.state.lineChartASelectedIndex]})
                </p>
              </div>
              <div className="scatter-a" id="scatter-a">
                c
              </div>
            </div>
            <div className="line">
              <div className="line-a" id="line-a">
                A
              </div>
              <div className="line-b" id="line-b">
                B
              </div>
            </div>
          </div>
        </div>
      </>
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
          id: "dataZoomX",
          type: "inside",
          xAxisIndex: [0],
          filterMode: "empty",
          startValue: this.state.startValue,
          endValue: this.state.endValue,
          zoomOnMouseWheel: "false",
          moveOnMouseMove: "false",
        },
      ],
      xAxis: {
        data: positions.map((position) => position.split(",")[0]),
        position: "top",
        boundaryGap: ["20%", "20%"],
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        position: "right",
        inverse: true,
        boundaryGap: false,
        alignTicks: true,
        splitLine: {
          show: false,
        },
      },

      axisPointer: {
        show: true,
      },

      series: [
        {
          name: "深度",
          type: "bar",
          stack: "A",
          data: positions.map((position) => position.split(",")[3]),
          selectedMode: "single",
        },
        {
          name: "增加",
          type: "bar",
          stack: "A",
          itemStyle: {
            color: "green",
          },
          selectedMode: "single",
        },
        {
          name: "缩减",
          type: "bar",
          stack: "A",
          itemStyle: {
            color: "#969596a8",
          },
          selectedMode: "single",
        },
        {
          name: "深度-1",
          type: "line",
          selectedMode: "single",
        },
      ],
    });
    this.zender = this.lineChartA.getZr();
    this.zender.on("mousedown", this.onmousedown);
    this.zender.on("mousemove", this.onmousemove);
    this.zender.on("mouseup", this.onmouseup);

    this.lineChartA.on("selectchanged", (params) => {
      const {
        selected,
        fromActionPayload: { seriesIndex },
      } = params;
      const data = selected;
      if (!selected || _.isUndefined(seriesIndex)) {
        return;
      }
      let dataIndex = 0;
      data.forEach((d) => {
        if (+d.seriesIndex === seriesIndex) {
          dataIndex = d.dataIndex[0];
        }
      });
      if (+dataIndex === +this.state.lineChartASelectedIndex) {
        return;
      }
      console.log(params, dataIndex);

      this.setState(
        {
          lineChartASelectedIndex: dataIndex,
        },
        () => {
          this.lineChartB.dispatchAction({
            type: "select",
            dataIndex,
          });
          this.scatterChartA.dispatchAction({
            type: "select",
            dataIndex,
          });
        }
      );
    });

    this.lineChartA.on("datazoom", ({ batch }) => {
      if (!batch) {
        return;
      }
      const data = batch[0];
      this.setState(
        {
          startValue: data.start,
          endValue: data.end,
        },
        () => {
          this.lineChartB.dispatchAction({
            type: "dataZoom",
            start: data.start,
            end: data.end,
          });
          this.scatterChartA.dispatchAction({
            type: "dataZoom",
            start: data.start,
            end: data.end,
          });
        }
      );
    });
  }

  private renderLineChartB(positions) {
    const newImageObj = new Image();
    newImageObj.src =
      "data:image/png;base64,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";
    this.lineChartB.setOption({
      title: {
        text: null,
      },
      tooltip: {},
      xAxis: {
        show: false,
        data: positions.map((position) => position.split(",")[0]),
        position: "top",
      },
      yAxis: {
        type: "value",
        inverse: false,
        boundaryGap: false,
        axisLine: { onZero: false },
        alignTicks: true,
        splitLine: {
          show: false,
        },
      },
      dataZoom: [
        {
          id: "dataZoomX",
          type: "inside",
          xAxisIndex: [0],
          filterMode: "empty",
          startValue: this.state.startValue,
          endValue: this.state.endValue,
          zoomOnMouseWheel: "false",
          moveOnMouseMove: "false",
        },
      ],
      axisPointer: {
        show: true,
      },
      series: [
        {
          name: "高度",
          type: "line",
          data: positions.map((position) => -1 * position.split(",")[3]),
          selectedMode: "single",
          smooth: 0.2,
          lineStyle: {
            color: "#5470C6",
            width: 2,
          },
          select: {
            disabled: false,
            label: {
              color: "rgba(255, 0, 0, 0)",
              show: true,
              height: 48,
              width: 48,
              fontSize: 48,
              formatter: "0",
              backgroundColor: {
                image: newImageObj,
              },
            },
          },
        },
      ],
    });
    this.lineChartB.on("selectchanged", (params) => {
      const { selected } = params;
      const data = selected[0];
      if (!selected) {
        return;
      }
      const { seriesIndex, dataIndex } = data;
      if (+dataIndex === +this.state.lineChartBSelectedIndex) {
        return;
      }
      this.setState(
        {
          lineChartBSelectedIndex: dataIndex,
        },
        () => {
          this.lineChartA?.dispatchAction({
            type: "select",
            seriesIndex,
            dataIndex,
          });
          this.scatterChartA.dispatchAction({
            type: "select",
            dataIndex,
          });
        }
      );
    });

    this.lineChartB.on("datazoom", ({ batch }) => {
      if (!batch) {
        return;
      }
      const data = batch[0];
      this.setState(
        {
          startValue: data.start,
          endValue: data.end,
        },
        () => {
          this.lineChartA.dispatchAction({
            type: "dataZoom",
            start: data.start,
            end: data.end,
          });
          this.scatterChartA.dispatchAction({
            type: "dataZoom",
            start: data.start,
            end: data.end,
          });
        }
      );
    });
  }

  private renderScatterChartA(positions) {
    const dataX = [];
    const dataY = [];
    let minY;
    let maxY;
    positions.forEach((position) => {
      const B = translate(position.split(",")[1]);
      const L = translate(position.split(",")[2]);
      const H = +position.split(",")[4];
      const res = wgs(B, L, H);
      dataX.push(res.X);
      dataY.push(res.Y);
      minY = isUndefined(minY) ? res.Y : minY > res.Y ? res.Y : minY;
      maxY = isUndefined(maxY) ? res.Y : maxY < res.Y ? res.Y : maxY;
    });
    this.scatterChartA.setOption({
      xAxis: {
        data: dataX,
      },
      yAxis: {
        min: minY,
        max: maxY,
      },
      dataZoom: [
        {
          id: "dataZoomX",
          type: "inside",
          xAxisIndex: [0],
          filterMode: "empty",
          startValue: this.state.startValue,
          endValue: this.state.startValue + 20,
          zoomOnMouseWheel: "false",
          moveOnMouseMove: "false",
        },
      ],
      series: [
        {
          name: "定位",
          data: dataY,
          symbol: "circle",
          smooth: true,
          type: "line",
          selectedMode: "single",
          select: {
            disabled: false,
            label: {
              color: "rgba(255, 0, 0, 0)",
              height: 48,
              width: 48,
              show: true,
              fontSize: 48,
              formatter: "0",
              backgroundColor: {
                image: this.image,
              },
            },
          },
        },
      ],
    });

    this.scatterChartA.on("selectchanged", (params) => {
      const { selected } = params;
      const data = selected[0];
      if (!selected) {
        return;
      }
      const { dataIndex } = data;
      if (+dataIndex === +this.state.scatterChartAelectedIndex) {
        return;
      }
      this.setState(
        {
          scatterChartAelectedIndex: dataIndex,
        },
        () => {
          this.lineChartB.dispatchAction({
            type: "select",
            dataIndex,
          });
          this.lineChartA.dispatchAction({
            type: "select",
            dataIndex,
          });
        }
      );
    });

    this.scatterChartA.on("datazoom", ({ batch }) => {
      if (!batch) {
        return;
      }
      const data = batch[0];
      this.setState(
        {
          startValue: data.start,
          endValue: data.end,
        },
        () => {
          this.lineChartA.dispatchAction({
            type: "dataZoom",
            start: data.start,
            end: data.end,
          });
          this.lineChartB.dispatchAction({
            type: "dataZoom",
            start: data.start,
            end: data.end,
          });
        }
      );
    });
  }

  // 键盘事件
  renderlLast = () => {
    const lastSelectedIndex = Math.max(
      this.state.lineChartASelectedIndex - 1,
      0
    );
    let lastEndValue = this.state.endValue;
    let lastStartValue = this.state.startValue;
    if (lastSelectedIndex > lastEndValue) {
      lastEndValue = lastEndValue + 1;
      lastStartValue = lastEndValue - 30;
    }
    if (lastSelectedIndex < lastStartValue) {
      lastStartValue = Math.max(lastStartValue - 1, 0);
      lastEndValue = lastStartValue + 30;
    }
    this.setState(
      {
        lineChartASelectedIndex: lastSelectedIndex,
        lineChartBSelectedIndex: lastSelectedIndex,
        scatterChartAelectedIndex: lastSelectedIndex,
        startValue: lastStartValue,
        endValue: lastEndValue,
      },
      () => {
        this.lineChartA.dispatchAction({
          type: "select",
          dataIndex: this.state.lineChartASelectedIndex,
        });
        this.lineChartA.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              startValue: this.state.startValue,
              endValue: this.state.endValue,
            },
          ],
        });
        this.lineChartB.dispatchAction({
          type: "select",
          dataIndex: this.state.lineChartBSelectedIndex,
        });
        this.lineChartB.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              startValue: this.state.startValue,
              endValue: this.state.endValue,
            },
          ],
        });
        this.scatterChartA.dispatchAction({
          type: "select",
          dataIndex: this.state.scatterChartAelectedIndex,
        });
        this.scatterChartA.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              startValue: this.state.startValue,
              endValue: this.state.endValue,
            },
          ],
        });
      }
    );
  };

  renderNext = () => {
    const lastSelectedIndex = Math.min(
      this.state.lineChartASelectedIndex + 1,
      this.state.dataSource.length
    );
    let lastEndValue = this.state.endValue;
    let lastStartValue = this.state.startValue;
    if (lastSelectedIndex > lastEndValue) {
      lastEndValue = lastEndValue + 1;
      lastStartValue = lastEndValue - 30;
    }
    if (lastSelectedIndex < lastStartValue) {
      lastStartValue = Math.max(lastStartValue - 1, 0);
      lastEndValue = lastStartValue + 30;
    }

    this.lineChartA.dispatchAction({
      type: "select",
      dataIndex: lastSelectedIndex,
    });
    this.lineChartA.setOption({
      dataZoom: [
        {
          id: "dataZoomX",
          startValue: lastEndValue,
          endValue: lastStartValue,
        },
      ],
    });
    this.lineChartB.dispatchAction({
      type: "select",
      dataIndex: lastSelectedIndex,
    });
    this.lineChartB.setOption({
      dataZoom: [
        {
          id: "dataZoomX",
          startValue: lastEndValue,
          endValue: lastStartValue,
        },
      ],
    });
    this.scatterChartA.dispatchAction({
      type: "select",
      dataIndex: lastSelectedIndex,
    });
    this.scatterChartA.setOption({
      dataZoom: [
        {
          id: "dataZoomX",
          startValue: lastEndValue,
          endValue: lastStartValue,
        },
      ],
    });
    this.setState({
      lineChartASelectedIndex: lastSelectedIndex,
      lineChartBSelectedIndex: lastSelectedIndex,
      scatterChartAelectedIndex: lastSelectedIndex,
      startValue: lastStartValue,
      endValue: lastEndValue,
    });
  };

  // 鼠标事件
  onmousedown = ({ event }) => {
    if (!this.state.mode) {
      return;
    }
    this.painting = true;
    let x = event.zrX;
    let y = event.zrY;
    this.lastPoint = { x: x, y: y };
    this.startPoint = this.lastPoint;
    switch (this.state.mode) {
      case "pencil":
        this.pencilTmp.push(this.lastPoint);
        this.drawPencil(x, y, 5);
        break;
      case "delete":
        this.pencilTmp.push(this.lastPoint);
        this.drawDelete(x, y, 5);
        break;
    }
  };

  onmousemove = ({ event }) => {
    if (!this.state.mode) {
      return;
    }
    if (this.painting) {
      let x = event.zrX;
      let y = event.zrY;
      let newPoint = { x: x, y: y };
      switch (this.state.mode) {
        case "pencil":
          this.pencilTmp.push(newPoint);
          this.drawLine(
            this.lastPoint.x,
            this.lastPoint.y,
            newPoint.x,
            newPoint.y
          );
          this.zender.remove(this.pencile);
          this.drawPencil(x, y, 5);
          this.lastPoint = newPoint;
          break;
        case "delete":
          this.pencilTmp.push(newPoint);
          this.drawLine(
            this.lastPoint.x,
            this.lastPoint.y,
            newPoint.x,
            newPoint.y
          );
          this.zender.remove(this.pencile);
          this.drawDelete(x, y, 5);
          this.lastPoint = newPoint;
      }
    }
  };

  onmouseup = () => {
    this.painting = false;
    this.endPoint = this.lastPoint;
    this.zender?.remove(this.pencile);
    //  // 清除line
    this.pencilLine.forEach((line) => {
      this.zender.remove(line);
    });
    switch (this.state.mode) {
      case "pencil":
        if (this.pencilTmp.length > 0) {
          // 补划线
          const { dataArray, dataSource } = this.computeDataArray();
          this.history.push({ dataArray, dataSource });
          this.setState(
            {
              historyIndex: this.history.length - 1,
              dataArray,
              dataSource,
            },
            this.draw
          );
        }
      case "delete":
        // 删除数据
        const { dataArray, dataSource } = this.computeDataArray();
        this.history.push({ dataArray, dataSource });
        this.setState(
          {
            historyIndex: this.history.length - 1,
            dataArray,
            dataSource,
          },
          this.draw
        );
    }
    // 清除缓存
    this.clearCache();
  };

  // 画点函数
  drawPencil = (x, y, radius) => {
    this.pencile = new Path(
      path.createFromString(
        "M358.681 586.386s-90.968 49.4-94.488 126.827c-3.519 77.428-77.427 133.74-102.063 140.778s360.157 22.971 332.002-142.444l-135.45-125.16z m169.099 52.56c14.016 13.601 17.565 32.675 7.929 42.606-9.635 9.93-28.81 6.954-42.823-6.647l-92.767-88.518c-14.015-13.6-17.565-32.675-7.929-42.605 9.636-9.93 28.81-6.955 42.824 6.646l92.766 88.518z m321.734-465.083c-25.144-17.055-47.741-1.763-57.477 3.805-29.097 19.485-237.243 221.77-327.69 315.194-11.105 14.8-18.59 26.294 34.663 79.546 44.95 44.95 65.896 42.012 88.66 22.603 37.906-37.906 199.299-262.926 258.92-348.713 9.792-14.092 29.851-54.17 2.924-72.435z",
        {
          style: {
            fill: "#5AC2EE",
          },
        }
      )
    );
    const rect = this.pencile.getBoundingRect();
    const m = rect.calculateTransform({
      x: x - radius * 5,
      y: y - radius * 5,
      width: radius * 5,
      height: radius * 5,
    });
    this.pencile.setLocalTransform(m);
    this.zender.add(this.pencile);
  };

  drawDelete = (x, y, radius) => {
    this.pencile = new Path(
      path.createFromString(
        "M882.515023 665.633011q33.407092 21.259059 53.653815 56.690823t20.246723 77.949882q0 33.407092-12.654202 62.258672t-34.419428 50.110638-50.616806 33.91326-62.258672 12.654202q-42.518117 0-77.443714-20.246723t-56.184655-52.641479q-4.049345-4.049345-7.086353-8.604857t-8.098689-9.617193q-16.197378-22.271395-20.246723-54.666151t-3.037008-67.320352 2.024672-68.838857-5.061681-60.234q-11.135697-20.246723-25.308403-44.036622t-31.38242-48.085966q-3.037008-4.049345-5.567849-7.086353t-4.555513-6.074017q-19.234386 23.283731-37.456437 46.567462t-37.456437 48.592134q-5.061681 6.074017-8.604857 12.148034t-8.604857 12.148034q-9.111025 19.234386-9.111025 33.407092t3.543176 27.839244 8.098689 27.839244 5.061681 32.900924-5.061681 44.036622-21.765227 60.740168q-17.209714 45.555126-57.703159 74.406705t-92.122588 28.85158q-33.407092 0-62.258672-12.654202t-50.616806-34.419428-34.419428-50.616806-12.654202-62.258672q0-36.444101 15.185042-67.826521t41.505781-53.653815q25.308403-26.320739 53.147647-44.036622t55.172319-32.900924 52.135311-30.370084 43.024285-36.444101q4.049345-5.061681 7.592521-10.123361t7.592521-10.123361l1.012336-1.012336q4.049345-8.098689 11.135697-15.185042 14.172706-18.22205 28.345412-37.962605t29.357748-39.987277q-26.320739-27.333075-45.048958-44.54279t-35.937933-40.493445q-35.431764-46.567462-59.727832-97.184268t-37.456437-96.171932-13.666538-81.493058 12.654202-53.147647q7.086353-5.061681 20.246723-7.592521t21.259059 9.617193q18.22205 27.333075 41.505781 62.76484t50.616806 76.431378 56.690823 85.542403 58.715495 88.073243q6.074017-8.098689 11.641865-16.703546t11.641865-16.703546q27.333075-39.481109 52.641479-81.493058t47.07363-80.480722 38.468773-69.345025 25.814571-47.07363q7.086353-11.135697 24.296067-11.641865t29.357748 10.629529q6.074017 6.074017 10.629529 34.925596t-3.037008 74.406705-32.394756 104.776789-77.443714 126.035848l-32.394756 40.493445q-16.197378 20.246723-33.407092 40.493445 23.283731 35.431764 44.036622 66.814184t37.962605 56.690823q25.308403 26.320739 51.122974 41.505781t49.098302 25.814571 43.530453 19.740554 35.431764 23.283731zM292.32306 874.174253q32.394756 0 55.172319-23.283731t22.777563-55.678487-22.777563-55.678487-55.172319-23.283731-55.678487 23.283731-23.283731 55.678487 23.283731 55.678487 55.678487 23.283731zM795.454116 874.174253q32.394756 0 55.172319-22.777563t22.777563-55.172319-22.777563-55.678487-55.172319-23.283731-55.678487 23.283731-23.283731 55.678487q0 16.197378 6.074017 30.370084t16.703546 24.802235 25.308403 16.703546 30.876252 6.074017z",
        {
          style: {
            fill: "#d81e06",
          },
        }
      )
    );
    const rect = this.pencile.getBoundingRect();
    const m = rect.calculateTransform({
      x: x - radius * 4,
      y: y - radius * 4,
      width: radius * 4,
      height: radius * 4,
    });
    this.pencile.setLocalTransform(m);
    this.zender.add(this.pencile);
  };

  drawLine = (x1, y1, x2, y2) => {
    const line = new Line({
      shape: {
        x1,
        x2,
        y1,
        y2,
      },
      style: {
        lineWidth: 3,
      },
    });
    this.pencilLine.push(line);
    this.zender.add(line);
  };

  // 点击画笔
  onClickPencil = (e) => {
    e.stopPropagation();
    this.setState({
      mode: this.state.mode === "pencil" ? undefined : "pencil",
    });
  };

  // 点击删除
  onClickDelete = (e) => {
    e.stopPropagation();
    this.setState({
      mode: this.state.mode === "delete" ? undefined : "delete",
    });
  };

  // 点击重置
  onClickRestore = (e) => {
    e.stopPropagation();
    this.lastPoint = { x: undefined, y: undefined };
    this.clearCache();
    this.setState(
      {
        mode: undefined,
        dataArray: [],
      },
      () => {
        this.lineChartA.dispatchAction({
          type: "restore",
        });
        this.lineChartB.dispatchAction({
          type: "restore",
        });
        this.scatterChartA.dispatchAction({
          type: "restore",
        });
      }
    );
  };

  // 上一步
  onClickPre = (e) => {
    e.stopPropagation();
    const curHistoryIndex = Math.max(-1, this.state.historyIndex - 1);
    const { dataArray, dataSource } = this.history[this.state.historyIndex] || {
      dataArray: [],
      dataSource: [...this.originData],
    };
    this.setState(
      {
        historyIndex: curHistoryIndex,
        dataArray,
        dataSource,
      },
      this.draw
    );
  };

  // 下一步
  onClickNext = (e) => {
    e.stopPropagation();
    this.setState(
      {
        historyIndex: Math.min(
          this.history.length - 1,
          this.state.historyIndex + 1
        ),
      },
      () => {
        const { dataArray, dataSource } = this.history[this.state.historyIndex];
        this.setState(
          {
            dataArray,
            dataSource,
          },
          this.draw
        );
      }
    );
  };

  // 下一桢
  onClickNextFare = (e) => {
    let lastEndValue = Math.min(
      this.state.endValue + 1,
      this.state.dataSource.length
    );
    const lastStartValue = Math.max(lastEndValue - 30, 0);
    let lastSelectedIndex = this.state.lineChartASelectedIndex;
    if (lastSelectedIndex < lastStartValue) {
      lastSelectedIndex = lastStartValue;
    }
    this.setState(
      {
        lineChartASelectedIndex: lastSelectedIndex,
        lineChartBSelectedIndex: lastSelectedIndex,
        scatterChartAelectedIndex: lastSelectedIndex,
        startValue: lastStartValue,
        endValue: lastEndValue,
      },
      () => {
        this.lineChartA.dispatchAction({
          type: "select",
          dataIndex: this.state.lineChartASelectedIndex,
        });
        this.lineChartA.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              startValue: this.state.startValue,
              endValue: this.state.endValue,
            },
          ],
        });
        this.lineChartB.dispatchAction({
          type: "select",
          dataIndex: this.state.lineChartBSelectedIndex,
        });
        this.lineChartB.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              startValue: this.state.startValue,
              endValue: this.state.endValue,
            },
          ],
        });
        this.scatterChartA.dispatchAction({
          type: "select",
          dataIndex: this.state.scatterChartAelectedIndex,
        });
        this.scatterChartA.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              startValue: this.state.startValue,
              endValue: this.state.endValue,
            },
          ],
        });
      }
    );
  };

  // 上一桢
  onClickPreFare = (e) => {
    let lastStartValue = Math.min(
      this.state.startValue - 1,
      this.state.dataSource.length
    );
    const lastEndValue = Math.max(lastStartValue + 30, 0);
    let lastSelectedIndex = this.state.lineChartASelectedIndex;
    if (lastSelectedIndex > lastEndValue) {
      lastSelectedIndex = lastEndValue;
    }
    this.setState(
      {
        lineChartASelectedIndex: lastSelectedIndex,
        lineChartBSelectedIndex: lastSelectedIndex,
        scatterChartAelectedIndex: lastSelectedIndex,
        startValue: lastStartValue,
        endValue: lastEndValue,
      },
      () => {
        this.lineChartA.dispatchAction({
          type: "select",
          dataIndex: this.state.lineChartASelectedIndex,
        });
        this.lineChartA.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              startValue: this.state.startValue,
              endValue: this.state.endValue,
            },
          ],
        });
        this.lineChartB.dispatchAction({
          type: "select",
          dataIndex: this.state.lineChartBSelectedIndex,
        });
        this.lineChartB.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              startValue: this.state.startValue,
              endValue: this.state.endValue,
            },
          ],
        });
        this.scatterChartA.dispatchAction({
          type: "select",
          dataIndex: this.state.scatterChartAelectedIndex,
        });
        this.scatterChartA.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              startValue: this.state.startValue,
              endValue: this.state.endValue,
            },
          ],
        });
      }
    );
  };

  onClickPlay = () => {
    this.setState(
      {
        mode: "play",
      },
      () => {
        this.playTimer = setInterval(this.onClickNextFare, 1000);
      }
    );
  };

  onClickPause = () => {
    this.setState(
      {
        mode: "pause",
      },
      () => {
        clearInterval(this.playTimer);
      }
    );
  };

  onClickMove = () => {
    this.setState(
      {
        mode: this.state.mode === "move" ? undefined : "move",
      },
      () => {
        this.lineChartA.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              moveOnMouseMove: this.state.mode === "move",
            },
          ],
        });
        this.lineChartB.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              moveOnMouseMove: this.state.mode === "move",
            },
          ],
        });
        this.scatterChartA.setOption({
          dataZoom: [
            {
              id: "dataZoomX",
              moveOnMouseMove: this.state.mode === "move",
            },
          ],
        });
      }
    );
  };

  // computeDataArray 计算数据
  computeDataArray = () => {
    const startData = this.lineChartA.convertFromPixel("grid", [
      this.startPoint.x,
      this.startPoint.y,
    ]);
    const endData = this.lineChartA.convertFromPixel("grid", [
      this.endPoint.x,
      this.endPoint.y,
    ]);
    const startIndex = Math.min(startData[0], endData[0]);
    const endIndex = Math.max(startData[0], endData[0]);
    const dataArray = [...this.state.dataArray];
    const dataSource = [...this.state.dataSource];
    switch (this.state.mode) {
      case "pencil":
        this.pencilTmp.forEach((position) => {
          const data = this.lineChartA.convertFromPixel("grid", [
            position.x,
            position.y,
          ]);
          const index = data[0];
          const value: number = data[1];
          dataArray[index] = +value.toFixed(2);
          let lastPosition;
          let nextPosition;
          for (let i = index - 1; i >= startIndex; i--) {
            if (!!dataArray[i]) {
              lastPosition = { x: i, y: dataArray[i] };
              break;
            }
          }
          for (let i = index + 1; i <= endIndex; i++) {
            if (!!dataArray[i]) {
              nextPosition = { x: i, y: dataArray[i] };
              break;
            }
          }
          //填补数据
          if (lastPosition) {
            for (let i = lastPosition.x + 1; i < index; i++) {
              dataArray[i] =
                value -
                ((index - i) / (index - lastPosition.x)) *
                  (value - lastPosition.y);
            }
          }
          if (nextPosition) {
            for (let i = index + 1; i <= nextPosition.x; i++) {
              dataArray[i] =
                value -
                ((index - i) / (index - nextPosition.x)) *
                  (value - nextPosition.y);
            }
          }
        });
        break;
      case "delete":
        dataSource.splice(startIndex, endIndex - startIndex + 1);
        dataArray.splice(startIndex, endIndex - startIndex + 1);
    }
    return { dataArray, dataSource };
  };

  // 画图
  draw = () => {
    // 计算增加和减少
    const addDataSource = [];
    const delDataSource = [];
    let minY;
    let maxY;
    let minPositionH;
    let maxPositionH;
    const dataX = [];
    const dataY = [];
    const positionX = [];
    const positionY = [];
    this.state.dataSource.forEach((item, index) => {
      const value = +item.split(",")[3];
      if (!_.isUndefined(this.state.dataArray[index])) {
        if (this.state.dataArray[index] > value) {
          addDataSource.push(+(this.state.dataArray[index] - value).toFixed(2));
          delDataSource.push(0);
        } else {
          addDataSource.push(0);
          delDataSource.push(+(value - this.state.dataArray[index]).toFixed(2));
        }
      } else {
        addDataSource.push(0);
        delDataSource.push(0);
      }
      const B = translate(item.split(",")[1]);
      const L = translate(item.split(",")[2]);
      const H = +item.split(",")[4];
      const level = +item.split(",")[3];
      const res = wgs(B, L, H);
      dataX.push(res.X);
      dataY.push(res.Y);
      positionX.push(item.split(",")[0]);
      positionY.push(level);
      minY = isUndefined(minY) ? res.Y : minY > res.Y ? res.Y : minY;
      maxY = isUndefined(maxY) ? res.Y : maxY < res.Y ? res.Y : maxY;
      minPositionH = isUndefined(minPositionH)
        ? Math.min(this.state.dataArray[index] || 0, level)
        : minPositionH > Math.min(this.state.dataArray[index] || 0, level)
        ? Math.min(this.state.dataArray[index] || 0, level)
        : minPositionH;
      maxPositionH = isUndefined(maxPositionH)
        ? Math.min(this.state.dataArray[index] || 0, level)
        : maxPositionH < Math.max(this.state.dataArray[index] || 0, level)
        ? Math.max(this.state.dataArray[index] || 0, level)
        : maxPositionH;
    });

    this.lineChartA.setOption({
      xAxis: {
        data: positionX,
      },
      yAxis: {
        min: minPositionH * 1.2,
        max: maxPositionH * 1.2,
      },
      series: [
        {
          name: "深度",
          data: positionY,
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
          data: this.state.dataArray,
        },
      ],
    });
    this.lineChartB.setOption({
      xAxis: {
        data: positionX,
      },
      series: [
        {
          name: "高度",
          data: positionY.map((position) => position * -1),
        },
      ],
    });
    this.scatterChartA.setOption({
      xAxis: {
        data: dataX,
      },
      series: [
        {
          name: "定位",
          data: dataY,
        },
      ],
    });
  };

  // 清除页面缓存
  clearCache() {
    this.pencilTmp = [];
    this.pencilLine = [];
  }
}
export default Home;
