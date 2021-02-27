const { spawn } = require('child_process');
const path = require('path');

const pythonPath = String.raw`C:\Users\10748\.virtualenvs\matlab-engine-for-python-YOtp9JHU\Scripts\python.exe`;

async function spawnChild(command, args = []) {
  const child = spawn(command, args);
  let data = '';
  let error = '';
  child.stdout.on('data', (chunk) => {
    data += chunk;
  });
  child.stderr.on('data', (chunk) => {
    error += chunk;
  });
  const exitCode = await new Promise((resolve) => {
    child.on('close', resolve);
  });

  if (exitCode) {
    throw new Error(`subprocess error exit ${exitCode}, ${error}`);
  }
  return { stdout: data, stderr: error, exitCode };
}

/**
 * @description 生成训练前、训练后、训练前后差值的地形图
 * @param {*} datavectors 训练前后的数据
 * @param {*} picPaths 地形图存储地址
 */
async function getTopoplots(datavectors, picPaths) {
  const getTopoplotPath = path.join(
    __dirname,
    '../matlab-engine-for-python/topoplot/getTopoplot.py'
  );
  await spawnChild(pythonPath, [
    getTopoplotPath,
    JSON.stringify(datavectors),
    JSON.stringify(picPaths),
  ]);
}
/**
 * @description 生成AIA表格数据
 * @param {*} datas [[训练前数据,训练后数据]]
 * @returns [AIA表格数据]
 */
async function AIA(datas) {
  const AIAPath = path.join(
    __dirname,
    '../matlab-engine-for-python/AIA/AIA.py'
  );
  const AIAResult = await spawnChild(pythonPath, [
    AIAPath,
    JSON.stringify(datas),
  ]).then(({ stdout }) => JSON.parse(stdout));
  return AIAResult;
}

async function SASI(datas) {
  const SASIPath = path.join(
    __dirname,
    '../matlab-engine-for-python/SASI/SASI.py'
  );
  const SASIResult = await spawnChild(pythonPath, [
    SASIPath,
    JSON.stringify(datas),
  ]).then(({ stdout }) => JSON.parse(stdout));
  return SASIResult;
}

async function DFA(datas) {
  const DFAPath = path.join(
    __dirname,
    '../matlab-engine-for-python/DFA/DFA.py'
  );
  const DFAResult = await spawnChild(pythonPath, [
    DFAPath,
    JSON.stringify(datas),
  ]).then(({ stdout }) => JSON.parse(stdout));
  return DFAResult;
}

module.exports = { getTopoplot: getTopoplots, AIA, SASI, DFA };
