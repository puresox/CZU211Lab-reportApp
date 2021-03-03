// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const echarts = require('echarts');
const path = require('path');
const fs = require('fs');
// eslint-disable-next-line import/no-dynamic-require
const calcIndexes = require(path.join(process.cwd(), './assets/calcIndexes'));

let userInfo;
const userDataPaths = {
  before: {
    eyeOpen: null,
    eyeClose: null,
  },
  after: {
    eyeOpen: null,
    eyeClose: null,
  },
};

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

function getPowerLineChart(divId, titleText) {
  const myChart = echarts.init(document.getElementById(divId), null, {
    renderer: 'svg',
  });
  const option = getOptionTemplate(titleText, '电极位', '绝对功率');
  option.series = [
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
  ];
  myChart.setOption(option);
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
  option.series = [
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
  ];
  myChart.setOption(option);
}

function getPowerBoxplotChart(divId, titleText) {
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
      data: [],
    },
    {
      name: '训练后',
      type: 'boxplot',
      data: [],
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

async function renderAiaArea() {
  // 获取数据
  const [eyeClose, eyeOpen] = await calcIndexes.AIA([
    [userDataPaths.before.eyeClose, userDataPaths.after.eyeClose],
    [userDataPaths.before.eyeOpen, userDataPaths.after.eyeOpen],
  ]);
  // 处理闭眼数据
  const ClosetableCells = document.querySelectorAll('#closeAiaTable tbody td');
  eyeClose.flat().forEach((num, index) => {
    ClosetableCells[index].insertAdjacentText('afterbegin', num.toFixed(3));
  });
  // 处理睁眼数据
  const OpentableCells = document.querySelectorAll('#openAiaTable tbody td');
  eyeOpen.flat().forEach((num, index) => {
    OpentableCells[index].insertAdjacentText('afterbegin', num.toFixed(3));
  });
}

async function renderSasiArea() {
  // 初始化：SASI特征值对照-闭眼
  const closeSASILine = getSasiLineChart(
    'closeSasiLine',
    'SASI特征值对照-闭眼'
  );
  // 初始化：SASI特征值对照-睁眼
  const openSASILine = getSasiLineChart('openSasiLine', 'SASI特征值对照-睁眼');
  // 异步更新数据
  const [
    beforeEyeClose,
    afterEyeClose,
    beforeEyeOpen,
    afterEyeOpen,
  ] = await calcIndexes.SASI([
    userDataPaths.before.eyeClose,
    userDataPaths.after.eyeClose,
    userDataPaths.before.eyeOpen,
    userDataPaths.after.eyeOpen,
  ]);
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
  const datavectors = [
    {
      datas: [beforeEyeClose, afterEyeClose],
      picPaths: [
        path.join(userInfo.userDataPath, './数据缓存', 'SASIc1.png'),
        path.join(userInfo.userDataPath, './数据缓存', 'SASIc2.png'),
        path.join(userInfo.userDataPath, './数据缓存', 'SASIc3.png'),
      ],
    },
    {
      datas: [beforeEyeOpen, afterEyeOpen],
      picPaths: [
        path.join(userInfo.userDataPath, './数据缓存', 'SASIo1.png'),
        path.join(userInfo.userDataPath, './数据缓存', 'SASIo2.png'),
        path.join(userInfo.userDataPath, './数据缓存', 'SASIo3.png'),
      ],
    },
  ];
  await calcIndexes.getTopoplot(datavectors);
  // 地形图
  const topographicalMapCells = document.querySelectorAll(
    '#sasiTopographicalMaps tbody td'
  );
  datavectors.forEach(({ picPaths }, i) => {
    picPaths.forEach((picPath, j) => {
      const img = document.createElement('img');
      img.src = picPath;
      img.className = 'topographicalMap';
      topographicalMapCells[3 * i + j].appendChild(img);
    });
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

async function renderPlvArea() {
  const datavectors = [
    {
      data: userDataPaths.before.eyeClose,
      picPaths: [
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVCloseBeforeTheta1.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVCloseBeforeAlpha1.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVCloseBeforeTheta2.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVCloseBeforeAlpha2.png'
        ),
      ],
    },
    {
      data: userDataPaths.after.eyeClose,
      picPaths: [
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVCloseAfterTheta1.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVCloseAfterAlpha1.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVCloseAfterTheta2.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVCloseAfterAlpha2.png'
        ),
      ],
    },
    {
      data: userDataPaths.before.eyeOpen,
      picPaths: [
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVOpenBeforeTheta1.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVOpenBeforeAlpha1.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVOpenBeforeTheta2.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVOpenBeforeAlpha2.png'
        ),
      ],
    },
    {
      data: userDataPaths.after.eyeOpen,
      picPaths: [
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVOpenAfterTheta1.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVOpenAfterAlpha1.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVOpenAfterTheta2.png'
        ),
        path.join(
          userInfo.userDataPath,
          './数据缓存',
          'PLVOpenAfterAlpha2.png'
        ),
      ],
    },
  ];
  const [
    beforeEyeClose,
    afterEyeClose,
    beforeEyeOpen,
    afterEyeOpen,
  ] = await calcIndexes.PLV(datavectors);
  const brainNetMapsCells = document.querySelectorAll('#plvArea tbody td');
  datavectors.forEach(({ picPaths }, i) => {
    picPaths.forEach((picPath, j) => {
      const img = document.createElement('img');
      img.src = picPath;
      img.className = 'brainNetMap';
      topographicalMapCells[3 * i + j].appendChild(img);
    });
  });
}

function renderAucArea() {
  // 表格
  const tableCells = document.querySelectorAll('#aucTable tbody td');
  tableCells.forEach((tableCell) => {
    tableCell.insertAdjacentText('afterbegin', '1');
  });
}

function getUserDataPaths() {
  const { userDataPath } = userInfo;
  const userBeforeDir = fs.readdirSync(path.join(userDataPath, './训练前'), {
    withFileTypes: true,
  });
  userBeforeDir.forEach((userBefore) => {
    if (!userBefore.isDirectory()) {
      if (userBefore.name.endsWith('o.mat')) {
        userDataPaths.before.eyeOpen = path.join(
          userDataPath,
          './训练前',
          userBefore.name
        );
      } else if (userBefore.name.endsWith('c.mat')) {
        userDataPaths.before.eyeClose = path.join(
          userDataPath,
          './训练前',
          userBefore.name
        );
      }
    }
  });
  const userAfterDir = fs.readdirSync(path.join(userDataPath, './训练后'), {
    withFileTypes: true,
  });
  userAfterDir.forEach((userAfter) => {
    if (!userAfter.isDirectory()) {
      if (userAfter.name.endsWith('o.mat')) {
        userDataPaths.after.eyeOpen = path.join(
          userDataPath,
          './训练后',
          userAfter.name
        );
      } else if (userAfter.name.endsWith('c.mat')) {
        userDataPaths.after.eyeClose = path.join(
          userDataPath,
          './训练后',
          userAfter.name
        );
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {});

ipcRenderer.on('getUser', (event, user) => {
  userInfo = user;
  const { name: username, age, gender } = userInfo;
  getUserDataPaths();
  // renderPowerArea();
  // renderAiaArea();
  // renderSasiArea();
  // renderDfaArea();
  // renderPlvArea();
  // renderAucArea();
  // 监听打印报告事件
  const printReportBtn = document.getElementById('printButton');
  printReportBtn.addEventListener('click', () => {
    const deviceName = document.getElementById('printerSelect').value;
    const options = {
      silent: true,
      deviceName,
      header: '年龄：',
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
