// eslint-disable-next-line import/no-extraneous-dependencies
const webContents = require('electron').remote.getCurrentWebContents();
const echarts = require('echarts');

function getOptionTemplate(titleText, xAxisName, yAxisName) {
  const xAxisData = Array.from({ length: 64 }, (_, i) => i + 1); // 横坐标是64导联
  return {
    title: {
      text: titleText,
    },
    tooltip: {},
    legend: {
      data: ['训练前', '训练后'],
      right: 'right',
    },
    xAxis: {
      name: xAxisName,
      data: xAxisData,
    },
    yAxis: {
      name: yAxisName,
    },
    grid: {},
    dataZoom: [
      {
        xAxisIndex: 0,
        type: 'slider',
        start: 0,
        end: 100,
      },
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: '训练前',
        type: 'line',
        data: [],
      },
      {
        name: '训练后',
        type: 'line',
        data: [],
      },
    ],
  };
}

function getPowerLineChart(divId, titleText, dataList) {
  const myChart = echarts.init(document.getElementById(divId), null, {
    renderer: 'svg',
  });
  const option = getOptionTemplate(titleText, '电极位', '绝对功率');
  option.series = [
    {
      name: '训练前',
      type: 'line',
      data: dataList[0],
    },
    {
      name: '训练后',
      type: 'line',
      data: dataList[1],
    },
  ];
  myChart.setOption(option);
}

function getSasiLineChart(divId, titleText, dataList) {
  const myChart = echarts.init(document.getElementById(divId), null, {
    renderer: 'svg',
  });
  const option = getOptionTemplate(titleText, '电极位', 'SASI值');
  option.series = [
    {
      name: '训练前',
      type: 'line',
      data: dataList[0],
    },
    {
      name: '训练后',
      type: 'line',
      data: dataList[1],
    },
  ];
  myChart.setOption(option);
}

function getDfaLineChart(divId, titleText, dataList) {
  const myChart = echarts.init(document.getElementById(divId), null, {
    renderer: 'svg',
  });
  const option = getOptionTemplate(titleText, '电极位', 'DFA值');
  option.series = [
    {
      name: '训练前',
      type: 'line',
      data: dataList[0],
    },
    {
      name: '训练后',
      type: 'line',
      data: dataList[1],
    },
  ];
  myChart.setOption(option);
}

function getPowerBoxplotChart(divId, titleText, dataList) {
  const myChart = echarts.init(document.getElementById(divId), null, {
    renderer: 'svg',
  });
  const option = getOptionTemplate(titleText, '指标', '绝对功率');
  option.xAxis.data = ['P3 Beta波', 'P4 Beta波', 'F3 Alpha波', 'F4 Alpha波'];
  option.dataZoom = undefined;
  option.series = [
    {
      name: '训练前',
      type: 'boxplot',
      data: dataList[0],
    },
    {
      name: '训练后',
      type: 'boxplot',
      data: dataList[1],
    },
  ];
  myChart.setOption(option);
}

function renderPowerArea() {
  // 训练前后各电极位的Theta频段功率变化
  getPowerLineChart('thetaPowerLine', '训练前后各电极位的Theta频段功率变化', [
    Array.from({ length: 64 }, (_, i) => i + 1),
    Array.from({ length: 64 }, (_, i) => i + 2),
  ]);
  // 训练前后各电极位的Alpha频段功率变化
  getPowerLineChart('alphaPowerLine', '训练前后各电极位的Alpha频段功率变化', [
    Array.from({ length: 64 }, (_, i) => i + 1),
    Array.from({ length: 64 }, (_, i) => i + 2),
  ]);
  // 训练前后各电极位的高Beta频段功率变化
  getPowerLineChart(
    'highBetaPowerLine',
    '训练前后各电极位的高Beta频段功率变化',
    [
      Array.from({ length: 64 }, (_, i) => i + 1),
      Array.from({ length: 64 }, (_, i) => i + 2),
    ]
  );
  // 训练前后各电极位的Gamma频段功率变化
  getPowerLineChart('gammaPowerLine', '训练前后各电极位的Gamma频段功率变化', [
    Array.from({ length: 64 }, (_, i) => i + 1),
    Array.from({ length: 64 }, (_, i) => i + 2),
  ]);
  // 箱线图
  getPowerBoxplotChart('powerBoxplot', '各指标绝对功率箱型图', [
    [
      [655, 850, 940, 980, 1175],
      [672.5, 800, 845, 885, 1012.5],
      [780, 840, 855, 880, 940],
      [621.25, 767.5, 815, 865, 1011.25],
    ],
    [
      [621.25, 767.5, 815, 865, 1011.25],
      [655, 850, 940, 980, 1175],
      [672.5, 800, 845, 885, 1012.5],
      [780, 840, 855, 880, 940],
    ],
  ]);
  // 地形图
  const topographicalMapCells = document.querySelectorAll(
    '#powerTopographicalMaps tbody td'
  );
  topographicalMapCells.forEach((topographicalMapCell) => {
    const img = document.createElement('img');
    img.src =
      '../appData/刘禹超_69a88b69-3f4c-4daf-a264-a58254c73799/训练前/2.png';
    img.className = 'topographicalMap';
    topographicalMapCell.appendChild(img);
  });
}

function renderAiaArea() {
  // 表格
  const tableCells = document.querySelectorAll('#aiaTable tbody td');
  tableCells.forEach((tableCell) => {
    tableCell.insertAdjacentText('afterbegin', '1');
  });
}

function renderSasiArea() {
  // SASI特征值对照-闭眼
  getSasiLineChart('closeSasiLine', 'SASI特征值对照-闭眼', [
    Array.from({ length: 64 }, (_, i) => i + 1),
    Array.from({ length: 64 }, (_, i) => i + 2),
  ]);
  // SASI特征值对照-睁眼
  getSasiLineChart('openSasiLine', 'SASI特征值对照-睁眼', [
    Array.from({ length: 64 }, (_, i) => i + 1),
    Array.from({ length: 64 }, (_, i) => i + 2),
  ]);
  // 地形图
  const topographicalMapCells = document.querySelectorAll(
    '#sasiTopographicalMaps tbody td'
  );
  topographicalMapCells.forEach((topographicalMapCell) => {
    const img = document.createElement('img');
    img.src =
      '../appData/刘禹超_69a88b69-3f4c-4daf-a264-a58254c73799/训练前/2.png';
    img.className = 'topographicalMap';
    topographicalMapCell.appendChild(img);
  });
}

function renderDfaArea() {
  // DFA特征值对照-闭眼
  getDfaLineChart('closeDfaLine', 'DFA特征值对照-闭眼', [
    Array.from({ length: 64 }, (_, i) => i + 1),
    Array.from({ length: 64 }, (_, i) => i + 2),
  ]);
  // DFA特征值对照-睁眼
  getDfaLineChart('openDfaLine', 'DFA特征值对照-睁眼', [
    Array.from({ length: 64 }, (_, i) => i + 1),
    Array.from({ length: 64 }, (_, i) => i + 2),
  ]);
  // 地形图
  const topographicalMapCells = document.querySelectorAll(
    '#dfaTopographicalMaps tbody td'
  );
  topographicalMapCells.forEach((topographicalMapCell) => {
    const img = document.createElement('img');
    img.src =
      '../appData/刘禹超_69a88b69-3f4c-4daf-a264-a58254c73799/训练前/2.png';
    img.className = 'topographicalMap';
    topographicalMapCell.appendChild(img);
  });
}

function renderPlvArea() {
  const brainNetMaps = document.querySelectorAll('#plvArea img');
  brainNetMaps.forEach((brainNetMap) => {
    // eslint-disable-next-line no-param-reassign
    brainNetMap.src =
      '../appData/刘禹超_69a88b69-3f4c-4daf-a264-a58254c73799/训练前/3.png';
  });
}

function renderAucArea() {
  // 表格
  const tableCells = document.querySelectorAll('#aucTable tbody td');
  tableCells.forEach((tableCell) => {
    tableCell.insertAdjacentText('afterbegin', '1');
  });
}

function renderPrinters() {
  // 获取打印设备
  const printers = webContents.getPrinters();
  const printerSelect = document.getElementById('printerSelect');
  printers.forEach((printer) => {
    const option = document.createElement('option');
    option.text = printer.name;
    option.value = printer.name;
    printerSelect.appendChild(option);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderPrinters();
  renderPowerArea();
  renderAiaArea();
  renderSasiArea();
  renderDfaArea();
  renderPlvArea();
  renderAucArea();
  // 监听打印报告事件
  const printReportBtn = document.getElementById('printButton');
  printReportBtn.addEventListener('click', () => {
    const deviceName = document.getElementById('printerSelect').value;
    const options = {
      silent: true,
      deviceName,
      header: '年龄：',
      footer: '姓名：',
    };
    webContents.print(options, (success, errorType) => {
      if (!success) console.log(errorType);
    });
  });
});
