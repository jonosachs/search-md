// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getMarkdown: (dir: string, filename: string) =>
    ipcRenderer.invoke("get-markdown", dir, filename),
  selectDirectory: (default_dir?: string) =>
    ipcRenderer.invoke("select-directory", default_dir),
});
