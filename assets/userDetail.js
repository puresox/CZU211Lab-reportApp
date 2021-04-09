// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const echarts = require('echarts');
// eslint-disable-next-line import/no-useless-path-segments
const { getCalcResultById } = require('../assets/db'); // html引用的js引用模块路径以html为基准

let userInfo;
let reportCalcResult;

function loadingAllImgTable() {
  const allImgTableCells = document.querySelectorAll(
    '.topographicalMapTable tbody td, .brainNetMapTable tbody td',
  );
  allImgTableCells.forEach((allImgTableCell) => {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loader-inner', 'ball-pulse');
    for (let index = 0; index < 3; index += 1) {
      const subLoadingDiv = document.createElement('div');
      loadingDiv.appendChild(subLoadingDiv);
    }
    allImgTableCell.appendChild(loadingDiv);
  });
}

function getOptionTemplate(titleText, xAxisName, yAxisName) {
  const xAxisData = Array.from({ length: 64 }, (_, i) => i + 1); // 横坐标是64导联
  return {
    title: {
      text: titleText,
      left: 'center',
      top: '12%',
      textStyle: {
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 'normal',
      },
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

function getPowerLineChart(divId, titleText) {
  const myChart = echarts.init(document.getElementById(divId), null, {
    renderer: 'svg',
  });
  const option = getOptionTemplate(titleText, '电极位', '绝对功率');
  myChart.setOption(option);
  myChart.showLoading();
  return myChart;
}

function getAIALineChart(divId, titleText) {
  const myChart = echarts.init(document.getElementById(divId), null, {
    renderer: 'svg',
  });
  const option = getOptionTemplate(
    titleText,
    '不同额区电极组合',
    '额叶不对称分数',
  );
  option.xAxis.data = [
    'F3/F4',
    '(Fp1,F3,F7)/\n(Fp2,F4,F8)',
    '(Fp1,F3,F7,F1,F5,AF3)/\n(Fp2,F4,F8,F2,F6,AF4)',
  ];
  option.dataZoom = undefined;
  myChart.setOption(option);
  myChart.showLoading();
  return myChart;
}

function getSasiLineChart(divId, titleText) {
  const myChart = echarts.init(document.getElementById(divId), null, {
    renderer: 'svg',
  });
  const option = getOptionTemplate(titleText, '电极位', 'SASI值');
  myChart.setOption(option);
  myChart.showLoading();
  return myChart;
}

function getDfaLineChart(divId, titleText) {
  const myChart = echarts.init(document.getElementById(divId), null, {
    renderer: 'svg',
  });
  const option = getOptionTemplate(titleText, '电极位', 'DFA值');
  myChart.setOption(option);
  myChart.showLoading();
  return myChart;
}

function getPowerBoxplotChart(divId, titleText) {
  const myChart = echarts.init(document.getElementById(divId), null, {
    renderer: 'svg',
  });
  const option = getOptionTemplate(titleText, '指标', '绝对功率');
  option.xAxis.data = ['P3 Beta波', 'P4 Beta波', 'F3 Alpha波', 'F4 Alpha波'];
  option.dataZoom = undefined;
  myChart.setOption(option);
  myChart.showLoading();
  return myChart;
}

async function renderPowerArea() {
  // 初始化：折线图-训练前后各电极位各频段功率变化
  // powerLines:[
  //   closeThetaPowerLine,
  //   openThetaPowerLine,
  //   closeAlphaPowerLine,
  //   openAlphaPowerLine,
  //   closeHighBetaPowerLine,
  //   openHighBetaPowerLine,
  //   closeGammaPowerLine,
  //   openGammaPowerLine,
  // ]
  const powerLines = [
    getPowerLineChart(
      'closeThetaPowerLine',
      '训练前后各电极位的Theta频段功率变化（闭眼）',
    ),
    getPowerLineChart(
      'openThetaPowerLine',
      '训练前后各电极位的Theta频段功率变化（睁眼）',
    ),
    getPowerLineChart(
      'closeAlphaPowerLine',
      '训练前后各电极位的Alpha频段功率变化（闭眼）',
    ),
    getPowerLineChart(
      'openAlphaPowerLine',
      '训练前后各电极位的Alpha频段功率变化（睁眼）',
    ),
    getPowerLineChart(
      'closeHighBetaPowerLine',
      '训练前后各电极位的高Beta频段功率变化（闭眼）',
    ),
    getPowerLineChart(
      'openHighBetaPowerLine',
      '训练前后各电极位的高Beta频段功率变化（睁眼）',
    ),
    getPowerLineChart(
      'closeGammaPowerLine',
      '训练前后各电极位的Gamma频段功率变化（闭眼）',
    ),
    getPowerLineChart(
      'openGammaPowerLine',
      '训练前后各电极位的Gamma频段功率变化（睁眼）',
    ),
  ];
  // 初始化：箱线图
  // powerBoxplots:[closePowerBoxplot, openPowerBoxplot]
  const powerBoxplots = [
    getPowerBoxplotChart('closePowerBoxplot', '各指标绝对功率箱型图（闭眼）'),
    getPowerBoxplotChart('openPowerBoxplot', '各指标绝对功率箱型图（睁眼）'),
  ];
  // 异步获取数据
  // POWERResults:[beforeEyeClose, afterEyeClose, beforeEyeOpen, afterEyeOpen]
  const POWERResults = reportCalcResult.power.result;
  // 异步更新：折线图-训练前后各电极位各频段功率变化
  powerLines.forEach((powerLine, index) => {
    powerLine.hideLoading();
    powerLine.setOption({
      series: [
        {
          name: '训练前',
          type: 'line',
          data: POWERResults[2 * (index % 2)][Math.floor(index / 2)],
        },
        {
          name: '训练后',
          type: 'line',
          data: POWERResults[2 * (index % 2) + 1][Math.floor(index / 2)],
        },
      ],
    });
  });
  // 异步更新：箱线图
  powerBoxplots.forEach((powerBoxplot) => {
    powerBoxplot.hideLoading();
    powerBoxplot.setOption({
      series: [
        {
          name: '训练前',
          type: 'boxplot',
          data: [
            [655, 850, 940, 980, 1175],
            [672.5, 800, 845, 885, 1012.5],
            [780, 840, 855, 880, 940],
            [621.25, 767.5, 815, 865, 1011.25],
          ],
        },
        {
          name: '训练后',
          type: 'boxplot',
          data: [
            [621.25, 767.5, 815, 865, 1011.25],
            [655, 850, 940, 980, 1175],
            [672.5, 800, 845, 885, 1012.5],
            [780, 840, 855, 880, 940],
          ],
        },
      ],
    });
  });
  // 地形图
  // 构造参数
  const picPathsArray = reportCalcResult.power.pic;
  // 填充数据
  const topographicalMapCells = document.querySelectorAll(
    '#powerArea tbody td',
  );
  picPathsArray.forEach((picPaths, i) => {
    picPaths.forEach((picPath, j) => {
      const img = document.createElement('img');
      img.src = picPath;
      img.className = 'topographicalMap';
      const topographicalMapCell = topographicalMapCells[3 * i + j];
      while (topographicalMapCell.firstChild) {
        topographicalMapCell.removeChild(topographicalMapCell.firstChild);
      }
      topographicalMapCell.appendChild(img);
    });
  });
}

async function renderAiaArea() {
  // 初始化：训练前后不同额区额叶不对称分数对照
  // [closeFAALine, closeFBALine, openFAALine, openFBALine]
  const aiaLines = [
    getAIALineChart('closeFAALine', '训练前后不同额区Alpha不对称分数对照-闭眼'),
    getAIALineChart(
      'closeFBALine',
      '训练前后不同额区高Beta不对称分数对照-闭眼',
    ),
    getAIALineChart('openFAALine', '训练前后不同额区Alpha不对称分数对照-睁眼'),
    getAIALineChart('openFBALine', '训练前后不同额区高Beta不对称分数对照-睁眼'),
  ];
  // 获取数据
  // [eyeClose, eyeOpen]
  const aiaResults = reportCalcResult.aia.result;
  // 处理闭眼数据
  const ClosetableCells = document.querySelectorAll('#closeAiaTable tbody td');
  aiaResults[0].flat().forEach((num, index) => {
    ClosetableCells[index].insertAdjacentText('afterbegin', num.toFixed(3));
  });
  // 处理睁眼数据
  const OpentableCells = document.querySelectorAll('#openAiaTable tbody td');
  aiaResults[1].flat().forEach((num, index) => {
    OpentableCells[index].insertAdjacentText('afterbegin', num.toFixed(3));
  });
  // 异步更新：折线图-训练前后不同额区额叶不对称分数对照
  aiaLines.forEach((aiaLine, index) => {
    aiaLine.hideLoading();
    aiaLine.setOption({
      series: [
        {
          name: '训练前',
          type: 'line',
          data: aiaResults[Math.floor(index / 2)].map(
            (matrix) => matrix[2 * (index % 2)],
          ),
        },
        {
          name: '训练后',
          type: 'line',
          data: aiaResults[Math.floor(index / 2)].map(
            (matrix) => matrix[2 * (index % 2) + 1],
          ),
        },
      ],
    });
  });
}

async function renderSasiArea() {
  // 初始化：SASI特征值对照-闭眼
  const closeSASILine = getSasiLineChart(
    'closeSasiLine',
    'SASI特征值对照-闭眼',
  );
  // 初始化：SASI特征值对照-睁眼
  const openSASILine = getSasiLineChart('openSasiLine', 'SASI特征值对照-睁眼');
  // 异步更新数据
  const [
    beforeEyeClose,
    afterEyeClose,
    beforeEyeOpen,
    afterEyeOpen,
  ] = reportCalcResult.sasi.result;
  // 更新：SASI特征值对照-闭眼
  closeSASILine.hideLoading();
  closeSASILine.setOption({
    series: [
      {
        name: '训练前',
        type: 'line',
        data: beforeEyeClose,
      },
      {
        name: '训练后',
        type: 'line',
        data: afterEyeClose,
      },
    ],
  });
  // 更新：SASI特征值对照-睁眼
  openSASILine.hideLoading();
  openSASILine.setOption({
    series: [
      {
        name: '训练前',
        type: 'line',
        data: beforeEyeOpen,
      },
      {
        name: '训练后',
        type: 'line',
        data: afterEyeOpen,
      },
    ],
  });
  // 地形图
  const picPathsArray = reportCalcResult.sasi.pic;
  const topographicalMapCells = document.querySelectorAll(
    '#sasiTopographicalMaps tbody td',
  );
  picPathsArray.forEach((picPaths, i) => {
    picPaths.forEach((picPath, j) => {
      const img = document.createElement('img');
      img.src = picPath;
      img.className = 'topographicalMap';
      const topographicalMapCell = topographicalMapCells[3 * i + j];
      while (topographicalMapCell.firstChild) {
        topographicalMapCell.removeChild(topographicalMapCell.firstChild);
      }
      topographicalMapCell.appendChild(img);
    });
  });
}

async function renderDfaArea() {
  // 初始化：DFA特征值对照-闭眼
  const closeDFALine = getDfaLineChart(
    'closeDfaLine',
    'DFA特征值对照-闭眼',
  );
  // 初始化：DFA特征值对照-睁眼
  const openDFALine = getDfaLineChart('openDfaLine', 'DFA特征值对照-睁眼');
  // 异步更新数据
  const [
    beforeEyeClose,
    afterEyeClose,
    beforeEyeOpen,
    afterEyeOpen,
  ] = reportCalcResult.dfa.result;
  // 更新：DFA特征值对照-闭眼
  closeDFALine.hideLoading();
  closeDFALine.setOption({
    series: [
      {
        name: '训练前',
        type: 'line',
        data: beforeEyeClose,
      },
      {
        name: '训练后',
        type: 'line',
        data: afterEyeClose,
      },
    ],
  });
  // 更新：DFA特征值对照-睁眼
  openDFALine.hideLoading();
  openDFALine.setOption({
    series: [
      {
        name: '训练前',
        type: 'line',
        data: beforeEyeOpen,
      },
      {
        name: '训练后',
        type: 'line',
        data: afterEyeOpen,
      },
    ],
  });
  // 地形图
  const picPathsArray = reportCalcResult.dfa.pic;
  const topographicalMapCells = document.querySelectorAll(
    '#dfaTopographicalMaps tbody td',
  );
  picPathsArray.forEach((picPaths, i) => {
    picPaths.forEach((picPath, j) => {
      const img = document.createElement('img');
      img.src = picPath;
      img.className = 'topographicalMap';
      const topographicalMapCell = topographicalMapCells[3 * i + j];
      while (topographicalMapCell.firstChild) {
        topographicalMapCell.removeChild(topographicalMapCell.firstChild);
      }
      topographicalMapCell.appendChild(img);
    });
  });
}

async function renderPlvArea() {
  const datavectors = reportCalcResult.plv.pic;
  const AUCResult = reportCalcResult.auc.result;
  const brainNetMapsCells = document.querySelectorAll('#plvArea tbody td');
  datavectors.forEach((picPaths, i) => {
    picPaths.forEach((picPath, j) => {
      const img = document.createElement('img');
      img.src = picPath;
      img.className = 'brainNetMap';
      const brainNetMapsCell = brainNetMapsCells[8 * Math.floor(i / 2) + 2 * j + (i % 2)];
      while (brainNetMapsCell.firstChild) {
        brainNetMapsCell.removeChild(brainNetMapsCell.firstChild);
      }
      brainNetMapsCell.appendChild(img);
    });
  });
  const tableCells = document.querySelectorAll('#aucArea tbody td');
  AUCResult.forEach((data, i) => {
    data.forEach((ranges, j) => {
      ranges.forEach((auc, k) => {
        tableCells[
          12 * Math.floor(i / 2) + 2 * j + 4 * k + (i % 2)
        ].insertAdjacentText('afterbegin', auc.toFixed(3));
      });
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadingAllImgTable();
});

ipcRenderer.on('getUser', async (event, user) => {
  userInfo = user;
  const { name: username, age, gender } = userInfo;
  reportCalcResult = await getCalcResultById(user.id);
  renderPowerArea();
  renderAiaArea();
  renderSasiArea();
  renderDfaArea();
  renderPlvArea();
  // 监听打印报告事件
  const printReportBtn = document.getElementById('printButton');
  printReportBtn.addEventListener('click', () => {
    const deviceName = document.getElementById('printerSelect').value;
    const options = {
      silent: false,
      deviceName,
      header: `姓名：${username}    年龄：${age}    性别：${gender}`,
      footer: `姓名：${username}    年龄：${age}    性别：${gender}`,
    };
    ipcRenderer.send('print', options);
  });
});

ipcRenderer.on('getPrinters', (event, printers) => {
  const printerSelect = document.getElementById('printerSelect');
  printers.forEach((printer) => {
    const option = document.createElement('option');
    option.text = printer.name;
    option.value = printer.name;
    printerSelect.appendChild(option);
  });
});
