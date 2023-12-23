export const useClose = (): void => {
  window.electron.ipcRenderer.send('exit-app')
}
