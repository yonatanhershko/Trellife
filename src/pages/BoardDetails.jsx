import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard, addBoardMsg, updateBoard } from '../store/actions/board.actions'
import { boardService } from '../services/board/'

import { GroupPreview } from "../cmps/GroupPreview.jsx"

export function BoardDetails() {
  const { boardId } = useParams()
  const boardFromStore = useSelector(storeState => storeState.boardModule.board)
  const [board, setBoard] = useState(boardFromStore)

  useEffect(() => {
    loadBoard(boardId)
  }, [boardId])

  useEffect(() => {
    setBoard(boardFromStore)
  }, [boardFromStore])

  async function handleAddGroup() {
    try {
      const newGroup = boardService.getEmptyGroup()
      const updatedBoard = {
        ...board,
        groups: [...board.groups, newGroup]
      }
      const savedBoard = await updateBoard(updatedBoard)
      setBoard(savedBoard)
    } catch (err) {
      console.error('Failed to add group:', err)
    }
  }

  const groups = board?.groups || []
  if (!board) return
  return (
    <section style={{background:board.style.background}} >
      <header className='groups-header'>
        <div className='groups-header-leftside'>
          <span className='groups-header-logo'> {board.title}</span>
          <img className='empty-star' src="../../../src\assets\styles\imgs\Icones\star.svg" />
        </div>
        <div className='groups-header-rightside'>
          <img className='user-img' src="../../../src\assets\imgs\user-img1.JPG" alt="" />
          <img className='user-img' src="../../../src\assets\imgs\user-img1.JPG" alt="" />
          <span className='member-img'></span>
        </div>
      </header>
      <section className="group-list-container" style={{background:board.style.background}} >
        {board && (
          <div className='group-container'>
            {groups.map(group => (
              <GroupPreview key={group.id} boardId={boardId} group={group} board={board} setBoard={setBoard} />
            ))}
            <div className='add-group' onClick={handleAddGroup}>

              <img src="../../../src/assets/styles/imgs/Icones/add.svg" alt="add" />
              <span  >
                Add another list </span>
            </div>
          </div>
        )}

        <Outlet />

      </section>
    </section>
  )
}