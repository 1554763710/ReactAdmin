
import React,{Component} from "react";
import ReactEcharts from 'echarts-for-react';
import echarts from "echarts";
export default class Pie extends Component{
  
  constructor(props){
    super(props);
    this.getOption = ()=>{
      const cellSize = [80, 80];
      function getVirtulData() {
        const date = +echarts.number.parseDate('2017-02-01');
        const end = +echarts.number.parseDate('2017-03-01');
        const dayTime = 3600 * 24 * 1000;
        let data = [];
        for (var time = date; time < end; time += dayTime) {
          data.push([
            echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 10000)
          ]);
        }
        return data;
      }
  
      const scatterData = getVirtulData();
  
      return {
        tooltip : {},
        legend: {
          data: ['工作', '娱乐', '睡觉'],
          bottom: 20
        },
        calendar: {
          top: 'middle',
          left: 'center',
          orient: 'vertical',
          cellSize: cellSize,
          yearLabel: {
            show: false,
            textStyle: {
              fontSize: 30
            }
          },
          dayLabel: {
            margin: 20,
            firstDay: 1,
            nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
          },
          monthLabel: {
            show: false
          },
          range: ['2017-02']
        },
        series: [{
          id: 'label',
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 1,
          label: {
            normal: {
              show: true,
              formatter: function (params) {
                return echarts.format.formatTime('dd', params.value[0]);
              },
              offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
              textStyle: {
                color: '#000',
                fontSize: 14
              }
            }
          },
          data: scatterData
        }]
      };
  
    }
  }
  
  componentDidUpdate (){
    this.getReactEcharts = (e)=>{
      this.app = e.echartsElement;
    }
    this.getOption = ()=>{
      const cellSize = [80, 80];
      const pieRadius = 30;
      function getVirtulData() {
        const date = +echarts.number.parseDate('2017-02-01');
        const end = +echarts.number.parseDate('2017-03-01');
        const dayTime = 3600 * 24 * 1000;
        let data = [];
        for (var time = date; time < end; time += dayTime) {
          data.push([
            echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 10000)
          ]);
        }
        return data;
      }
      function getPieSeries(scatterData, chart) {
        return echarts.util.map(scatterData, function (item, index) {
          const center = chart.convertToPixel('calendar', item);
          return {
            id: index + 'pie',
            type: 'pie',
            center: center,
            label: {
              normal: {
                formatter: '{c}',
                position: 'inside'
              }
            },
            radius: pieRadius,
            data: [
              {name: '工作', value: Math.round(Math.random() * 24)},
              {name: '娱乐', value: Math.round(Math.random() * 24)},
              {name: '睡觉', value: Math.round(Math.random() * 24)}
            ]
          };
        });
      }
      const scatterData = getVirtulData();
      function getPieSeriesUpdate(scatterData, chart) {
        return echarts.util.map(scatterData, function (item, index) {
          const center = chart.convertToPixel('calendar', item);
          return {
            id: index + 'pie',
            center: center
          };
        });
      }
      const myChart = echarts.init(this.app);
      if (!this.app.inNode) {
        let pieInitialized;
        setTimeout(function () {
          pieInitialized = true;
          myChart.setOption({
            series: getPieSeries(this.scatterData, myChart)
          });
        }, 10);

        this.app.onresize = function () {
          if (pieInitialized) {
            myChart.setOption({
              series: getPieSeriesUpdate(this.scatterData, myChart)
            });
          }
        };
      }
      return {
        tooltip : {},
        legend: {
          data: ['工作', '娱乐', '睡觉'],
          bottom: 20
        },
        calendar: {
          top: 'middle',
          left: 'center',
          orient: 'vertical',
          cellSize: cellSize,
          yearLabel: {
            show: false,
            textStyle: {
              fontSize: 30
            }
          },
          dayLabel: {
            margin: 20,
            firstDay: 1,
            nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
          },
          monthLabel: {
            show: false
          },
          range: ['2017-02']
        },
        series: [{
          id: 'label',
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 1,
          label: {
            normal: {
              show: true,
              formatter: function (params) {
                return echarts.format.formatTime('dd', params.value[0]);
              },
              offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
              textStyle: {
                color: '#000',
                fontSize: 14
              }
            }
          },
          data: scatterData
        }]
      };
    }
    
  }
  
  render(){
    return <ReactEcharts
      ref={this.getReactEcharts}
      option={this.getOption()}
    />
  }
}