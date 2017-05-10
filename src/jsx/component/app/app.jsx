import React from 'react'
import { ipcRenderer } from 'electron'

import Header from 'jsx/component/app/header'
import ThreadBox from 'jsx/component/app/thread_box'
import PostBox from 'jsx/component/app/post_box'
import Footer from 'jsx/component/app/footer'

// アプリケーションのメインウィンドウ
export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.bindEvents = this.bindEvents.bind(this)
    this.addBoard = this.addBoard.bind(this)
    this.addThread = this.addThread.bind(this)
    this.getCurrentUrl = this.getCurrentUrl.bind(this)
    this.setCurrentUrl = this.setCurrentUrl.bind(this)
    this.setListMode = this.setListMode.bind(this)
    this.state = {
      boards: [],
      threads: [],
      currentBoardIndex: 0,
      currentThreadIndex: 0,
      currentUrl: "",
      listMode: "THREADS"
    }
    this.bindEvents()
    ipcRenderer.send('add-arg-board')
  }

  bindEvents() {
    ipcRenderer.on('add-board-reply', (event, board) => {
      this.addBoard(board)
    })
    ipcRenderer.on('add-thread-reply', (event, thread) => {
      this.addThread(thread)
    })
  }

  addBoard(board) {
    this.setState({
      boards: this.state.boards.concat(board),
      currentUrl: board.url,
      currentBoardIndex: this.state.boards.length,
      listMode: "THREADS"
    })
  }

  addThread(thread) {
    this.setState({
      threads: this.state.threads.concat(thread),
      currentUrl: thread.url,
      currentThreadIndex: this.state.threads.length,
      listMode: "POSTS"
    })
  }

  // 現在のスレッドを取得
  get currentThread() {
    if (this.state.threads.length > 0) {
      return this.state.threads[this.state.currentThreadIndex]
    } else {
      return { name: "", url: "", posts: [] }
    }
  }

  // 指定したリストモードの現在のURLを取得  
  getCurrentUrl(listMode) {
    let url = ""
    if (listMode == "THREADS" && this.state.boards.length > 0) {
      url = this.state.boards[this.state.currentBoardIndex].url
    } else if(listMode == "POSTS" && this.state.boards.length > 0) {
      url = this.state.boards[this.state.currentBoardIndex].threads[this.state.currentThreadIndex].url
    }
    return url    
  }

  setCurrentUrl(url) {
    this.setState({ currentUrl: url })
  }

  setListMode(listMode) {
    this.setState({ listMode: listMode })
  }

  render() {
    {/*一覧*/ }
    var compornents = {
      "THREADS": <ThreadBox state={this.state} />,
      "POSTS": <PostBox state={this.state} posts={this.currentThread.posts} />
    }
    console.log(this.currentThreadPosts)
    return (
      <div>
        <Header state={this.state}
          setListMode={this.setListMode}
          setCurrentUrl={this.setCurrentUrl}
          getCurrentUrl={this.getCurrentUrl} />
        {compornents[this.state.listMode]}
        {/*書き込み欄*/}
        <div id="post-form" className="form-group">
          <textarea className="form-control" rows="3" />
        </div>
        <Footer />
      </div>
    )
  }

}
