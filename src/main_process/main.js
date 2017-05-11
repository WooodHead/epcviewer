import {app, BrowserWindow, ipcMain} from 'electron'
import {Board, Thread} from '2ch-parser'

var window = { app: null }

// 引数URL
const argUrl = global.process.argv[2] ? global.process.argv[2] : ""

/*-----------------------------------------
  アプリケーション起動準備完了時
-----------------------------------------*/
app.on('ready', ()=>{

  window.app = new BrowserWindow({
    width: 320,
    height: 130,
    minHeight: 130
  })
  window.app.loadURL(`file://${__dirname}/html/app.html`)

  window.app.openDevTools()

  var jbbs = new Board("http://jbbs.shitaraba.net/internet/22724/")
  // jbbs.fetchThreads((res)=>{
  //   console.log(res)
  // })

  // 閉じた時
  window.app.on('close', ()=>{
    window.main = null
  })

})

/*-----------------------------------------
  すべてのウィンドウが閉じられた時
-----------------------------------------*/
app.on('window-all-closed', ()=>{
  if(process.platform != 'darwin') app.quit()
})

/*-----------------------------------------
  イベントをバインド
-----------------------------------------*/
// ------- URLのBoardを返す -------
ipcMain.on('add-board', (event, url) => {
  var board = new Board(url)
  board.fetchThreads((res)=>{
    event.sender.send('add-board-reply', {
      url: board.url,
      threads: res.body
    })
  })
})

// ------- 引数URLのBoardを返す -------
ipcMain.on('add-arg-board', (event) => {
  var board = new Board(argUrl)
  board.fetchThreads((res)=>{
    event.sender.send('add-board-reply', board)
  })
})

// ------- URLのThreadを返す -------
ipcMain.on('add-thread', (event, threadUrl) => {
  var thread = new Thread(threadUrl)
  thread.fetchAllPosts((res) => {
    event.sender.send('add-thread-reply', thread)
  })
})

// ------- URLのThreadを表示する -------
ipcMain.on('show-thread', (event, threadUrl) => {
  event.sender.send('show-thread-reply', threadUrl)
})