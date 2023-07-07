import Vue from "vue"
import Vuex from "vuex"
import startState from "@/store/startState"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tasks: startState,
        historyArray: [],
        historyArrayIndex: 0,
        clickInclude: [],
        row: {
            isActive: false,
            number: -1,
        },
        action: {
            isActive: false,
            name: "",
        },
        showTaskModal: false,
        showDeleteModal: false,
        id: 0,
    },
    getters: {
        taskStringified(state) {
            let taskObject = {
                taskName: "",
                subtasks: [],
            }
            if (state.row.number !== -1 && state.action.name === "edit") {
                taskObject = state.tasks[state.row.number]
            }
            return JSON.stringify(taskObject)
        },
        historyArrayCurrentElement(state) {
            return state.historyArray[state.historyArrayIndex]
        },
    },
    mutations: {
        SET_IDS(state) {
            for (let i = 0; i < state.tasks.length; i++) {
                state.tasks[i].id = ++state.id
                for (let j = 0; j < state.tasks[i].subtasks.length; j++) {
                    state.tasks[i].subtasks[j].id = ++state.id
                }
            }
        },
        INCREASE_ID(state) {
            state.id += 1
        },
        LOCAL_STORAGE_GET(state, tasks) {
            state.tasks = tasks
        },
        ADD_INCLUDE_ELEMENTS(state, newElements) {
            state.clickInclude = state.clickInclude.concat(newElements)
        },
        SET_HISTORY_STATE(state, initialTaskState) {
            state.historyArray = [initialTaskState]
            state.historyArrayIndex = 0
        },
        UPDATE_ROW_IS_ACTIVE(state, newValue) {
            state.row.isActive = newValue
        },
        UPDATE_ROW_NUMBER(state, newValue) {
            state.row.number = newValue
        },
        UPDATE_ACTION_IS_ACTIVE(state, newValue) {
            state.action.isActive = newValue
        },
        UPDATE_ACTION_NAME(state, newValue) {
            state.action.name = newValue
        },
        UPDATE_HISTORY(state, { newTaskState, index }) {
            state.historyArray.length = index + 1
            state.historyArray.push(newTaskState)
            state.historyArrayIndex++
        },
        HISTORY_STEP(state, step) {
            state.historyArrayIndex += step
        },
        DEACTIVATE_ROW_AND_ACTION(state) {
            state.row.isActive = false
            state.action.isActive = false
        },
        SHOW_TASK_MODAL(state, newValue) {
            state.showTaskModal = newValue
        },
        SHOW_DELETE_MODAL(state, newValue) {
            state.showDeleteModal = newValue
        },
        CHECKBOX_VALUE_CHANGE(state, { taskIndex, subtaskIndex }) {
            state.tasks[taskIndex].subtasks[subtaskIndex].checked =
                !state.tasks[taskIndex].subtasks[subtaskIndex].checked
        },
        SAVE_TASK(state, { updatedTask, index }) {
            Vue.set(state.tasks, index, updatedTask)
        },
        UNSHIFT_NEW_TASK(state, newTask) {
            state.tasks.unshift(newTask)
            state.row.number = 0
        },
        DELETE_TASK(state, index) {
            state.tasks.splice(index, 1)
        },
        LOCAL_STORAGE_SET(state, tasks) {
            localStorage.setItem("tasks", JSON.stringify(tasks))
        },
    },
    actions: {
        setIds({ commit }) {
            commit("SET_IDS")
        },
        getId({ commit, state }) {
            commit("INCREASE_ID")
            return state.id
        },
        localStorageGet({ commit }) {
            let tasks = localStorage.getItem("tasks")
            if (tasks === null) return
            commit("LOCAL_STORAGE_GET", JSON.parse(tasks))
        },
        addIncludeElements({ commit }, includeElements) {
            commit("ADD_INCLUDE_ELEMENTS", includeElements)
        },
        setHistoryState({ commit, getters }) {
            commit("SET_HISTORY_STATE", getters.taskStringified)
        },
        updateRow({ commit, state, dispatch }, rowNumber) {
            if (rowNumber === -1) {
                commit("UPDATE_ROW_IS_ACTIVE", false)
                return
            }
            commit("UPDATE_ROW_IS_ACTIVE", true)
            commit("UPDATE_ROW_NUMBER", rowNumber)
            if (state.action.isActive === false) return
            commit("DEACTIVATE_ROW_AND_ACTION")
            switch (state.action.name) {
                case "edit":
                    commit("SHOW_TASK_MODAL", true)
                    dispatch("setHistoryState")
                    break
                case "delete":
                    commit("SHOW_DELETE_MODAL", true)
                    break
                default:
                    break
            }
        },
        updateAction({ commit, state, dispatch }, action) {
            if (
                action === "" ||
                (action === state.action.name && state.action.isActive)
            ) {
                commit("UPDATE_ACTION_IS_ACTIVE", false)
                return
            }
            commit("UPDATE_ACTION_IS_ACTIVE", true)
            commit("UPDATE_ACTION_NAME", action)
            if (action === "add") {
                commit("SHOW_TASK_MODAL", true)
                commit("DEACTIVATE_ROW_AND_ACTION")
                return
            }
            if (!state.row.isActive) return
            commit("DEACTIVATE_ROW_AND_ACTION")
            switch (action) {
                case "edit":
                    commit("SHOW_TASK_MODAL", true)
                    dispatch("setHistoryState")
                    break
                case "delete":
                    commit("SHOW_DELETE_MODAL", true)
                    break
                default:
                    break
            }
        },
        updateHistory({ commit, state }, taskObject) {
            commit("UPDATE_HISTORY", {
                newTaskState: JSON.stringify(taskObject),
                index: state.historyArrayIndex,
            })
        },
        historyStep({ commit }, step) {
            commit("HISTORY_STEP", step)
        },
        checkboxValueChange({ commit, state }, { taskIndex, subtaskIndex }) {
            commit("CHECKBOX_VALUE_CHANGE", { taskIndex, subtaskIndex })
            commit("LOCAL_STORAGE_SET", state.tasks)
        },
        saveTask({ commit, state }, taskObject) {
            commit("SAVE_TASK", {
                updatedTask: JSON.parse(JSON.stringify(taskObject)),
                index: state.row.number,
            })
            commit("LOCAL_STORAGE_SET", state.tasks)
        },
        async unshiftNewTask({ commit, state, dispatch }, taskObject) {
            taskObject.id = await dispatch("getId")
            commit("UNSHIFT_NEW_TASK", JSON.parse(JSON.stringify(taskObject)))
            commit("LOCAL_STORAGE_SET", state.tasks)
        },
        deleteTask({ commit, state }) {
            commit("DELETE_TASK", state.row.number)
            commit("LOCAL_STORAGE_SET", state.tasks)
        },
        closeTaskModal({ commit }) {
            commit("SHOW_TASK_MODAL", false)
        },
        closeDeleteModal({ commit }) {
            commit("SHOW_DELETE_MODAL", false)
        },
    },
})
