const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

const pythonPath = String.raw`C:\Users\10748\.virtualenvs\matlab-engine-for-python-YOtp9JHU\Scripts\python.exe`;

async function AIA(beforeDataPath, afterDataPath) {
  const AIAPath = path.join(
    __dirname,
    '../matlab-engine-for-python/AIA/AIA.py'
  );
  const AIAResult = await exec(
    `${pythonPath} ${AIAPath} ${beforeDataPath} ${afterDataPath}`
  ).then((error, stdout) => JSON.parse(stdout.toString()));
  return AIAResult;
}

async function SASI(dataPath) {
  const SASIPath = path.join(
    __dirname,
    '../matlab-engine-for-python/SASI/SASI.py'
  );
  const SASIResult = await exec(
    `${pythonPath} ${SASIPath} ${dataPath}`
  ).then((error, stdout) => JSON.parse(stdout.toString()));
  return SASIResult;
}

async function DFA(dataPath) {
  const DFAPath = path.join(
    __dirname,
    '../matlab-engine-for-python/DFA/DFA.py'
  );
  const DFAResult = await exec(
    `${pythonPath} ${DFAPath} ${dataPath}`
  ).then((error, stdout) => JSON.parse(stdout.toString()));
  return DFAResult;
}

module.exports = { AIA, SASI, DFA };
