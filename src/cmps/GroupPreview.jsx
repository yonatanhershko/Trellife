import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { boardService } from '../services/board/'
import { updateBoard } from '../store/actions/board.actions'
import { GroupPreviewHeader } from './GroupPreviewHeader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import autosize from 'autosize';


export function GroupPreview({ group, boardId, board, setBoard }) {
    const tasks = group?.tasks || []
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

    async function handleAddTask() {
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
            const savedBoard = await updateBoard(updatedBoard)
            setBoard(savedBoard)
            console.log(newTask)
            setNewTaskTitle('')

        } catch (err) {
            console.error('Failed to add task:', err)
        }
    }


    function handleTitleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddTask()
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
                board={board}
                setBoard={setBoard}
                openMenuGroupId={openMenuGroupId}
                setOpenMenuGroupId={setOpenMenuGroupId}
            />
            <div className="group-preview-tasks">
                {tasks.map(task => (
                    <div key={task.id} className="task-container" onClick={() => handleTaskClick(task.id)}>
                        <div className='task-preview'>
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
                                {task.description && task.description.trim() !== '' && (
                                    <span className='task-description'><img src="../../../src/assets/imgs/Icons/description.svg" alt="description" /></span>
                                )}

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

                        </div>

                    </div>
                ))}
                {isAddingTask && (
                    <div className='addtask-from-container' ref={addTaskRef}>
                        <form className='addtask-form' onSubmit={(e) => e.preventDefault()}>
                            <textarea
                                type="text"
                                value={newTaskTitle}
                                onChange={(e)=> setNewTaskTitle(e.target.value)}
                                onKeyPress={handleTitleKeyPress}
                                autoFocus
                                placeholder="Enter a title for this card..."
                                ref={textareaRef}
                            />
                            <div className='addtask-btns'>
                                <span onClick={handleAddTask}>Add card</span>
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