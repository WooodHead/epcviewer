import React from 'react'

import Tab from 'jsx/component/common/tab'
import Subject from 'jsx/component/app/subject'

/* 板一覧 */
export default class BoardBox extends React.Component {

  constructor(props) {
    super(props)
  }

  get currentBoard() {
    if(this.hasBoard) return this.props.boards[this.props.currentBoardIndex]
  }

  get hasBoard() {
    return this.props.boards.length > 0
  }

  // Subjectコンポーネントに渡す用のハッシュ
  getSubjects = (board) => {
    let subjects= board.threads.map((thread, index) => {
      // スレッド名とレス数を抽出
      const match = thread.title.match(/^(.+)\((\d+)\)$/)
      return { 'no': Number(index+1), 'title': match[1], 'count': Number(match[2]), 'url': thread.url }
    })
    // ソート処理
    let disabledSubject = subjects.filter(subject => { if (subject.count >= 1000) return true })
    let enabledSubject = subjects.filter(subject => { if (subject.count < 1000) return true }).sort((a, b) => {
      // 1000レス未満のスレッドはレス数が多い順に
      if (a.count > b.count) return -1
      return 1
    })
    return enabledSubject.concat(disabledSubject)
  }

  _removeBoard = (boardUrl) => {
    if(this.hasBoard) this.props.removeBoard(boardUrl)
  }

  _selectBoard = (index) => {
    if(this.hasBoard) this.props.selectBoard(index)
  }

  render() {
    let subjects = []
    let tabs = []
    if (this.hasBoard) {
      subjects = this.getSubjects(this.currentBoard).map((subject) => {
        return <Subject key={subject.no} subject={subject} threads={this.props.threads}/>
      })
      tabs = this.props.boards.map((board, index) => {
        const active = this.props.currentBoardIndex==index
        return (
          <Tab key={index} index={index} name={board.url} url={board.url} active={active}
            removeTab={this._removeBoard} selectTab={this._selectBoard} />
        )
      })
    }

    return (
      <div id="board-box">
        {/*板タブ*/}
        <div id="board-tab-box">
          <div className="tab-group">
            {tabs}
          </div>
        </div>
        {/*スレッド名一覧*/}
        <div id="subject-box">
          {subjects}
        </div>
      </div>
    )
  }

}
