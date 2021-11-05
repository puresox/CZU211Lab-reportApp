// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const { upgradeUser, upgradeCalcResults } = require("./db");
const {
  getTopoplot,
  POWER,
  AIA,
  SASI,
  DFA,
  LZC,
  PLV,
} = require("./indicatorApi");

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

// 获取脑电数据地址
function getUserDataPaths() {
  const { userDataPath } = userInfo;
  const userBeforeDir = fs.readdirSync(path.join(userDataPath, "./训练前"), {
    withFileTypes: true,
  });
  const userAfterDir = fs.readdirSync(path.join(userDataPath, "./训练后"), {
    withFileTypes: true,
  });
  if (userBeforeDir.length !== 2 || userAfterDir.length !== 2) {
    throw new Error("找不到数据文件");
  }
  userBeforeDir.forEach((userBefore) => {
    if (!userBefore.isDirectory()) {
      if (userBefore.name.endsWith("o.mat")) {
        userDataPaths.before.eyeOpen = path.join(
          userDataPath,
          "./训练前",
          userBefore.name
        );
      } else if (userBefore.name.endsWith("c.mat")) {
        userDataPaths.before.eyeClose = path.join(
          userDataPath,
          "./训练前",
          userBefore.name
        );
      }
    }
  });
  userAfterDir.forEach((userAfter) => {
    if (!userAfter.isDirectory()) {
      if (userAfter.name.endsWith("o.mat")) {
        userDataPaths.after.eyeOpen = path.join(
          userDataPath,
          "./训练后",
          userAfter.name
        );
      } else if (userAfter.name.endsWith("c.mat")) {
        userDataPaths.after.eyeClose = path.join(
          userDataPath,
          "./训练后",
          userAfter.name
        );
      }
    }
  });
}

async function powerPromise() {
  // POWERResults:[beforeEyeClose, afterEyeClose, beforeEyeOpen, afterEyeOpen]
  const POWERResults = await POWER([
    userDataPaths.before.eyeClose,
    userDataPaths.after.eyeClose,
    userDataPaths.before.eyeOpen,
    userDataPaths.after.eyeOpen,
  ]);
  // 构造参数
  const datavectors = [];
  for (let index = 0; index < 8; index += 1) {
    const datavector = {
      datas: [
        POWERResults[2 * (index % 2)][Math.floor(index / 2)],
        POWERResults[2 * (index % 2) + 1][Math.floor(index / 2)],
      ],
      picPaths: [],
    };
    let range = "Theta";
    if (Math.floor(index / 2) === 0) {
      range = "Theta";
    } else if (Math.floor(index / 2) === 1) {
      range = "Alpha";
    } else if (Math.floor(index / 2) === 2) {
      range = "Beta";
    } else {
      range = "Gamma";
    }
    for (let j = 1; j <= 3; j += 1) {
      datavector.picPaths.push(
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          `POWER${index % 2 === 0 ? "Close" : "Open"}${range}${j}.png`
        )
      );
    }
    datavectors.push(datavector);
  }
  // 获取地形图
  await getTopoplot(datavectors);
  const picPathsArray = datavectors.map((datavector) => datavector.picPaths);
  await upgradeCalcResults(userInfo.id, {
    power: { result: POWERResults, pic: picPathsArray },
  });
}

async function aiaPromise() {
  // [eyeClose, eyeOpen]
  const aiaResults = await AIA([
    [userDataPaths.before.eyeClose, userDataPaths.after.eyeClose],
    [userDataPaths.before.eyeOpen, userDataPaths.after.eyeOpen],
  ]);
  await upgradeCalcResults(userInfo.id, {
    aia: { result: aiaResults },
  });
}

async function sasiPromise() {
  const [beforeEyeClose, afterEyeClose, beforeEyeOpen, afterEyeOpen] =
    await SASI([
      userDataPaths.before.eyeClose,
      userDataPaths.after.eyeClose,
      userDataPaths.before.eyeOpen,
      userDataPaths.after.eyeOpen,
    ]);
  // 地形图
  const datavectors = [
    {
      datas: [beforeEyeClose, afterEyeClose],
      picPaths: [
        path.join(userInfo.userDataPath, "./数据缓存", "SASIc1.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "SASIc2.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "SASIc3.png"),
      ],
    },
    {
      datas: [beforeEyeOpen, afterEyeOpen],
      picPaths: [
        path.join(userInfo.userDataPath, "./数据缓存", "SASIo1.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "SASIo2.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "SASIo3.png"),
      ],
    },
  ];
  await getTopoplot(datavectors);
  const picPathsArray = datavectors.map((datavector) => datavector.picPaths);
  await upgradeCalcResults(userInfo.id, {
    sasi: {
      result: [beforeEyeClose, afterEyeClose, beforeEyeOpen, afterEyeOpen],
      pic: picPathsArray,
    },
  });
}

async function dfaPromise() {
  // 多进程计算
  const [beforeEyeClose, afterEyeClose, beforeEyeOpen, afterEyeOpen] =
    await DFA([
      userDataPaths.before.eyeClose,
      userDataPaths.after.eyeClose,
      userDataPaths.before.eyeOpen,
      userDataPaths.after.eyeOpen,
    ]);
  // 地形图
  const datavectors = [
    {
      datas: [beforeEyeClose, afterEyeClose],
      picPaths: [
        path.join(userInfo.userDataPath, "./数据缓存", "DFAc1.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "DFAc2.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "DFAc3.png"),
      ],
    },
    {
      datas: [beforeEyeOpen, afterEyeOpen],
      picPaths: [
        path.join(userInfo.userDataPath, "./数据缓存", "DFAo1.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "DFAo2.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "DFAo3.png"),
      ],
    },
  ];
  await getTopoplot(datavectors);
  const picPathsArray = datavectors.map((datavector) => datavector.picPaths);
  await upgradeCalcResults(userInfo.id, {
    dfa: {
      result: [beforeEyeClose, afterEyeClose, beforeEyeOpen, afterEyeOpen],
      pic: picPathsArray,
    },
  });
}

async function lzcPromise() {
  // 多进程计算
  const [beforeEyeClose, afterEyeClose, beforeEyeOpen, afterEyeOpen] =
    await LZC([
      userDataPaths.before.eyeClose,
      userDataPaths.after.eyeClose,
      userDataPaths.before.eyeOpen,
      userDataPaths.after.eyeOpen,
    ]);
  // 地形图
  const datavectors = [
    {
      datas: [beforeEyeClose, afterEyeClose],
      picPaths: [
        path.join(userInfo.userDataPath, "./数据缓存", "LZCc1.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "LZCc2.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "LZCc3.png"),
      ],
    },
    {
      datas: [beforeEyeOpen, afterEyeOpen],
      picPaths: [
        path.join(userInfo.userDataPath, "./数据缓存", "LZCo1.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "LZCo2.png"),
        path.join(userInfo.userDataPath, "./数据缓存", "LZCo3.png"),
      ],
    },
  ];
  await getTopoplot(datavectors);
  const picPathsArray = datavectors.map((datavector) => datavector.picPaths);
  await upgradeCalcResults(userInfo.id, {
    lzc: {
      result: [beforeEyeClose, afterEyeClose, beforeEyeOpen, afterEyeOpen],
      pic: picPathsArray,
    },
  });
}

async function plvPromise() {
  const datavectors = [
    {
      data: userDataPaths.before.eyeClose,
      picPaths: [
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVCloseBeforeTheta1.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVCloseBeforeAlpha1.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVCloseBeforeTheta2.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVCloseBeforeAlpha2.png"
        ),
      ],
    },
    {
      data: userDataPaths.after.eyeClose,
      picPaths: [
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVCloseAfterTheta1.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVCloseAfterAlpha1.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVCloseAfterTheta2.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVCloseAfterAlpha2.png"
        ),
      ],
    },
    {
      data: userDataPaths.before.eyeOpen,
      picPaths: [
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVOpenBeforeTheta1.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVOpenBeforeAlpha1.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVOpenBeforeTheta2.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVOpenBeforeAlpha2.png"
        ),
      ],
    },
    {
      data: userDataPaths.after.eyeOpen,
      picPaths: [
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVOpenAfterTheta1.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVOpenAfterAlpha1.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVOpenAfterTheta2.png"
        ),
        path.join(
          userInfo.userDataPath,
          "./数据缓存",
          "PLVOpenAfterAlpha2.png"
        ),
      ],
    },
  ];
  const AUCResult = await PLV(datavectors);
  const picPathsArray = datavectors.map((datavector) => datavector.picPaths);
  await upgradeCalcResults(userInfo.id, {
    plv: {
      pic: picPathsArray,
    },
    auc: {
      result: AUCResult,
    },
  });
}

ipcRenderer.on("getUser", async (event, user) => {
  userInfo = user;
  getUserDataPaths();
  await upgradeUser(user.id, {
    calcState: "计算中",
  });
  await Promise.all([
    // powerPromise(),
    // aiaPromise(),
    // sasiPromise(),
    // dfaPromise(),
    lzcPromise(),
    // plvPromise(),
  ]);
  await upgradeUser(user.id, {
    calcState: "已计算",
  });
  ipcRenderer.send("reloadIndex");
  window.close();
});

window.addEventListener("error", (error) => {
  ipcRenderer.send("showError", error);
});
window.addEventListener("unhandledrejection", (error) => {
  ipcRenderer.send("showError", error);
});
