<template>
    <div ref="chartRef" :style="{ height, width }"></div>

</template>
<script lang="ts">
import {defineComponent, PropType, ref, Ref, onMounted, watch} from 'vue';

import { useECharts } from '/@/hooks/web/useECharts';
//  这样使用chart的某一个组件
import 'echarts/lib/chart/gauge'



export default defineComponent({
  props: {
    width: {
      type: String as PropType<string>,
      default: '1500px'
      // default: '300%',
    },
    height: {
      type: String as PropType<string>,
      default: '500px'
    },
    node: {},
    chartRef: {},
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null);
    // chartRef.value = props.chartRef
    const { node } = props
    const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

    // 封装一个方法，传入node对象，返回 echart的option
    function formatOption(node) {
      var option =  {
        backgroundColor: '#0f375f',
        title: [
          {
            text: 'ecs厂商占比',
            left: '20%',
            top: '1%',
            textStyle: {
              color: '#1bf10d',
              fontSize: 14,
            },
          },
          {
            text: 'ecs操作系统',
            left: '40%',
            top: '1%',
            textStyle: {
              color: '#9ef00d',
              fontSize: 14,
            },
          },
          {
            text: 'ecs区域',
            left: '20%',
            top: '50%',
            textStyle: {
              color: '#eb7007',
              fontSize: 14,
            },
          },
        ],
        grid: [{ left: '50%', top: '7%', width: '40%', height: '70%' }],

        // grid: [
        //   { x: "2%", y: "5%", width: "40%", height: "18%" },
        //   { x: "50%", y: "5%", width: "40%", height: "18%" },
        //   { x: "2%", y: "45%", width: "40%", height: "18%" },
        //   { x: "50%", y: "45%", width: "40%", height: "18%" },
        // ],

        tooltip: {
          formatter: '{b} ({c})',
        },
        xAxis: [
          {
            gridIndex: 0,
            axisTick: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false },
            axisLine: { show: false },
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            interval: 0,
            data: node.groupByOSNameOrderKeys,
            axisTick: { show: false },
            axisLabel: {
              show: true,
              textStyle: {
                fontWeight: 'bold',
                color: '#dac11d',  //更改坐标轴文字颜色
                fontSize : 14      //更改坐标轴文字大小
              }
            },
            splitLine: { show: false },
            axisLine: { show: true, lineStyle: { color: '#6173a3' }, },
          },
        ],
        series: [
          {
            name: 'ecs厂商占比',
            type: 'pie',
            radius: '30%',
            center: ['22%', '25%'],
            data: node.groupByVendor,
            labelLine: {show: true },
            label: {
              show: true,
              position: 'outside',
              //  b 代表的 name 中文名
              //  c 代表的数字
              // d 代表的 百分比
              formatter: '{b}:{c}个 {d}% ',
              color: '#dd5718',
              fontSize: 14,
            },
          },
          {
            name: 'ecs区域',
            type: 'pie',
            radius: '30%',
            center: ['22%', '75%'],
            labelLine: { show: true },
            data: node.groupByZoneId,
            label: {
              show: true,
              formatter: '{b}:{c}个 {d}% ',
              color: '#1bf10d',
              fontSize: 14,
            },
          },
          {
            name: 'ecs操作系统',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            barWidth: '45%',
            itemStyle: { color: '#86c9f4' ,},
            label: {
                show: true,
                position: 'right',
                color: '#9EA7C4' ,
                textStyle: {
                  color: '#eb7007',
                  fontSize: 14,
                },
            },
            data: node.groupByOSNameOrderValues,
          },

        ],
      }

      return option
    }


    watch(
      () => props.node,
      (newValue, oldValue) => {
        console.log('ecs-chart中监听node 变化新的值',newValue,)
        console.log('ecs-chart中监听node 变化旧的值',oldValue, )
        setOptions(formatOption(newValue))
      }
    )

    onMounted(() => {
      console.log("echart初始化：拿到父级对象",node)

      setOptions(formatOption(node))
    });


    return { chartRef };
  },
});
</script>
