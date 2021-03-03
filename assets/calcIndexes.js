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
 * @param {*} datavectors [{datas:[训练前一维数组,训练后一维数组],picPaths:[地形图存储地址]}]
 */
async function getTopoplot(datavectors) {
  const getTopoplotPath = path.join(
    __dirname,
    '../matlab-engine-for-python/topoplot/getTopoplot.py'
  );
  await spawnChild(pythonPath, [getTopoplotPath, JSON.stringify(datavectors)]);
}
/**
 * @description 生成AIA表格数据
 * @param {*} datas [[训练前mat数据,训练后mat数据]]
 * @returns [AIA表格二维数组]
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
/**
 * @description 生成SASI数据
 * @param {*} datas [mat数据]
 * @returns [SASI一维数组]
 */
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
/**
 * @description 生成DFA数据
 * @param {*} datas [mat数据]
 * @returns [DFA一维数组]
 */
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
/**
 * @description 生成脑网络图片和AUC数据
 * @param {*} datavectors [{data:mat数据,picPaths:[theta矩阵图存储地址,alpha矩阵图存储地址,theta拓扑图存储地址,alpha拓扑图存储地址,]}]
 * @returns [[aucs,aucpath,auccluster]]
 */
async function PLV(datavectors) {
  const PLVPath = path.join(
    __dirname,
    '../matlab-engine-for-python/PLV/PLV.py'
  );
  const PLVResult = await spawnChild(pythonPath, [
    PLVPath,
    JSON.stringify(datavectors),
  ]).then(({ stdout }) => JSON.parse(stdout));
  return PLVResult;
}

module.exports = { getTopoplot, AIA, SASI, DFA, PLV };
