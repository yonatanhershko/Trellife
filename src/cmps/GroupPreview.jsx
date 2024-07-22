import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { boardService } from '../services/board/'
import { updateBoard } from '../store/actions/board.actions'
import { GroupPreviewHeader } from './GroupPreviewHeader'
import autosize from 'autosize'
import { getFormattedShortTime } from '../services/util.service'
import { useSelector } from 'react-redux'


export function GroupPreview({ group, boardId }) {
    const tasks = group?.tasks || []
    const board = useSelector(storeState => storeState.boardModule.board)

    const [openMenuGroupId, setOpenMenuGroupId] = useState(null)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const addTaskRef = useRef(null)
    const [taskToEdit, setTaskToEdit] = useState(null)
    const textareaRef = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        function handleClickOutside(event) {
            if (addTaskRef.current && !addTaskRef.current.contains(event.target)) {
                setIsAddingTask(false)
                setNewTaskTitle('')
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [addTaskRef])

    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }

        return () => {
            if (textareaRef.current) {
                autosize.destroy(textareaRef.current);
            }
        }
    }, [newTaskTitle])

    function handleTaskClick(taskId) {
        navigate(`/board/${boardId}/${group.id}/${taskId}`, { replace: true })

    }

    async function onAddTask() {
        if (!newTaskTitle.trim()) return

        try {
            const newTask = boardService.getEmptyTask()
            newTask.title = newTaskTitle.trim()
            const updatedGroup = {
                ...group,
                tasks: [...group.tasks, newTask]
            }
            const updatedBoard = {
                ...board,
                groups: board.groups.map(g => g.id === group.id ? updatedGroup : g)
            }
            await updateBoard(updatedBoard)
            setNewTaskTitle('')

        } catch (err) {
            console.error('Failed to add task:', err)
        }
    }

    function handleTitleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            onAddTask()
            setNewTaskTitle('')
            if (addTaskRef.current) {
                const input = addTaskRef.current.querySelector('input')
                if (input) {
                    setTimeout(() => {
                        input.focus()
                    }, 0)
                }
            }
        }
    }

    function getMemberById(id) {
        return board.members.find(member => member._id === id)
    }

    function getLabelById(id) {
        return board.labels.find(label => label.id === id)
    }

    const labelsIds = taskToEdit?.labelsIds || []

    return (
        <section className="group-preview-container">
            <GroupPreviewHeader
                group={group}
                openMenuGroupId={openMenuGroupId}
                setOpenMenuGroupId={setOpenMenuGroupId}
            />
            <div className="group-preview-tasks">
                {tasks.map(task => (
                    <div key={task.id} className="task-container" onClick={() => handleTaskClick(task.id)}>
                        <div className='task-preview'>
                            {task.style && (
                                <section className='task-cover-container' style={{ ...task.style }}>
                                </section>
                            )}

                            <section className='task-info-container'>

                                <div className='task-container1'>
                                    {task.labelsIds && task.labelsIds.map(id => {
                                        const label = getLabelById(id)
                                        return label && (
                                            <div
                                                className="label-tab"
                                                key={id}
                                                style={{ backgroundColor: label.color }}
                                                title={label.title}
                                            >
                                                <span className="label-title">{label.title}</span>
                                            </div>
                                        )
                                    })}

                                </div>

                                <div className='task-container2'>
                                    <span>{task.title}</span>
                                </div>

                                <div className='pen-display'>
                                    <img src="../../../src\assets\imgs\Icons\pen.svg" />
                                </div>
                                <div className='task-container3'>
                                    <div className='container3-leftside'>
                                        {task.dueDate && (
                                            <div
                                                title={task.status === 'done' ? 'This task is complete.' : 'This task is due later.'}
                                                className="task-timer-container"
                                                style={task.status === 'inProgress' ? {} : { backgroundColor: '#4BCE97' }}
                                            >
                                                <img
                                                    src="../../../src/assets/imgs/Icons/clock.svg"
                                                    alt="clock icon"
                                                    style={task.status === 'inProgress' ? {} : { filter: 'brightness(0) saturate(100%) invert(9%) sepia(13%) saturate(697%) hue-rotate(169deg) brightness(97%) contrast(91%)' }}
                                                />
                                                <span
                                                    style={task.status === 'inProgress' ? {} : { color: '#1d2125' }}

                                                >{getFormattedShortTime(task.dueDate)}</span>
                                            </div>
                                        )}
                                        {task.description && task.description.trim() !== '' && (
                                            <img title='This card has a description.' src="../../../src/assets/imgs/Icons/description.svg" alt="description" />
                                        )}
                                        <div title='Comments' className='task-comment-container'>
                                            <img src="../../../src\assets\imgs\Icons\comment.svg" />
                                            <span className='task-comment'>1 </span>
                                        </div>

                                        <div title='Attachments' className='task-attachment-container'>
                                            <img src="../../../src\assets\imgs\TaskDetails-icons\attachment.svg" />
                                            <span className='task-comment'>1</span>
                                        </div>

                                        <div title='Checklist items' className='task-checklist-container' >
                                            <img src="../../../src\assets\imgs\Icons\checklist.svg" />
                                            <span className='task-checklist'>0/1</span>
                                        </div>
                                    </div>

                                    <div className='members-container'>
                                        {task.membersIds && task.membersIds.map(id => {
                                            const member = getMemberById(id)
                                            return (
                                                <img
                                                    key={member._id}
                                                    className="member-thumbnail"
                                                    src={member.imgUrl}
                                                    title={member.fullname}
                                                    alt={member.fullname}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>

                            </section>
                        </div>
                    </div>
                ))}
                {isAddingTask && (
                    <div className='addtask-from-container' ref={addTaskRef}>
                        <form className='addtask-form' onSubmit={(e) => e.preventDefault()}>
                            <textarea
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyPress={handleTitleKeyPress}
                                autoFocus
                                placeholder="Enter a title for this card..."
                                ref={textareaRef}
                            />
                            <div className='addtask-btns'>
                                <span onClick={onAddTask}>Add card</span>
                                <div className="close-btn-wrapper" onClick={() => {
                                    setIsAddingTask(false)
                                    setNewTaskTitle('')
                                }}>
                                    <img src="../../../src/assets/imgs/Icons/close.svg" alt="" />
                                </div>
                            </div>
                        </form>
                    </div>)}
            </div>
            {!isAddingTask && (
                <footer className='group-preview-footer'>
                    <span className="add-icon" onClick={() => setIsAddingTask(true)}>
                        <img src="../../../src/assets/imgs/Icons/add.svg" alt="add" />
                        Add a card
                    </span>
                </footer>
            )}
        </section>
    )
}