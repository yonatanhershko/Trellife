const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId, getRandomTimestamp } from '../util.service'

import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

const service = VITE_LOCAL === 'true' ? local : remote
export const boardService = { getEmptyTask, getEmptyGroup, getEmptyBoard, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local



function getEmptyBoard() {
    return {
        title: '',
        isStarred: false,
        archivedAt: null,
        createdBy: {},
        style: {
            backgroundImage: 'https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        labels: [
            {
                id: makeId(),
                title: '',
                color: '#216E4E'
            },
            {
                id: makeId(),
                title: '',
                color: '#7F5F01'
            },
            {
                id: makeId(),
                title: '',
                color: '#A54800'
            },
            {
                id: makeId(),
                title: '',
                color: '#AE2E24'
            },
            {
                id: makeId(),
                title: '',
                color: '#5E4DB2'
            },
            {
                id: makeId(),
                title: '',
                color: '#0055CC'
            }
        ],
        members: [],
        groups: [],
        activities: [],
    }
}

function getDefaultFilter() {
    return {
        title: ''
    }
}

function getEmptyGroup(title = 'New List') {
    return {
        id: makeId(),
        title: title,
        tasks: [],
        style: {},
        archivedAt: getRandomIntInclusive(0, 9) < 3 ? getRandomTimestamp() : null,
    }
}


function getEmptyTask() {
    return {
        id: 't' + makeId(),
        title: '',
        isDone: false,
        priority: '',
        dueDate: null,
        description: '',
        checklists: [],
        membersIds: [],
        labelsIds: [],
        byMember: {},
        style: null,
        attachments: []


    }
}

if (DEV) window.boardService = boardService

