const path = require("path");
const url = require("url");
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const connectDB = require("./config/db");
const Log = require("./models/Log");

console.log("ENV::: ", process.env.NODE_ENV);

connectDB();

let mainWindow;

let isDev = false;
const isMac = process.platform === "darwin";

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  isDev = true;
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    show: false,
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  let indexPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  await mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    if (isDev) {
      const devTools = new BrowserWindow();
      mainWindow.webContents.setDevToolsWebContents(devTools.webContents);
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }

    mainWindow.show();
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

const clearLogs = async () => {
  try {
    await Log.deleteMany({});
    mainWindow.webContents.send("logs:clear");
  } catch (error) {
    console.log(error);
  }
};

const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  { role: "fileMenu" },
  { role: "editMenu" },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forceReload" },
            { role: "separator" },
            { role: "toggledevtools" },
            { label: "Clear Logs", click: () => clearLogs() },
          ],
        },
      ]
    : []),
];

app.on("ready", async () => {
  // Open devtools if dev
  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require("electron-devtools-installer");

    await installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
      console.log("Error loading React DevTools: ", err)
    );
  }
  await createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
});

const sendLogs = async () => {
  try {
    const logs = await Log.find().sort({ createdAt: 1 });
    console.log(logs);
    mainWindow.webContents.send("logs:get", JSON.stringify(logs));
  } catch (error) {
    console.log(error);
  }
};

ipcMain.on("logs:load", sendLogs);
ipcMain.on("logs:add", async (e, item) => {
  console.log(item);
  try {
    await Log.create(item);
    sendLogs();
  } catch (error) {
    console.log(error);
  }
});
ipcMain.on("logs:remove", async (e, id) => {
  console.log(id);
  try {
    await Log.deleteOne({ id });
    sendLogs();
  } catch (error) {
    console.log(error);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Stop error
app.allowRendererProcessReuse = true;
