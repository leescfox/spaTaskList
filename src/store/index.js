import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tasks: getMock(),
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
    },
    getters: {
        tasks(state) {
            return state.tasks
        },
        clickInclude(state) {
            return state.clickInclude
        },
        rowIsActive(state) {
            return state.row.isActive
        },
        rowNumber(state) {
            return state.row.number
        },
        actionIsActive(state) {
            return state.action.isActive
        },
        actionName(state) {
            return state.action.name
        },
        showTaskModal(state) {
            return state.showTaskModal
        },
        showDeleteModal(state) {
            return state.showDeleteModal
        },
        taskStringified(state, getters) {
            let taskObject = {
                taskName: "",
                subtasks: [],
            }
            if (getters.rowNumber !== -1 && getters.actionName === "edit") {
                taskObject = getters.tasks[getters.rowNumber]
            }
            return JSON.stringify(taskObject)
        },
        historyArrayLength(state) {
            return state.historyArray.length
        },
        historyArrayIndex(state) {
            return state.historyArrayIndex
        },
        historyArrayCurrentElement(state, getters) {
            return state.historyArray[getters.historyArrayIndex]
        },
    },
    mutations: {
        localStorageGet(state, tasks) {
            state.tasks = tasks
        },
        addIncludeElements(state, newElements) {
            state.clickInclude = state.clickInclude.concat(newElements)
        },
        setHistoryState(state, initialTaskState) {
            state.historyArray = [initialTaskState]
            state.historyArrayIndex = 0
        },
        updateRowIsActive(state, newValue) {
            state.row.isActive = newValue
        },
        updateRowNumber(state, newValue) {
            state.row.number = newValue
        },
        updateActionIsActive(state, newValue) {
            state.action.isActive = newValue
        },
        updateActionName(state, newValue) {
            state.action.name = newValue
        },
        updateHistory(state, { newTaskState, index }) {
            state.historyArray.length = index + 1
            state.historyArray.push(newTaskState)
            state.historyArrayIndex++
        },
        historyStep(state, step) {
            state.historyArrayIndex += step
        },
        deactivateRowAndAction(state) {
            state.row.isActive = false
            state.action.isActive = false
        },
        showTaskModal(state, newValue) {
            state.showTaskModal = newValue
        },
        showDeleteModal(state, newValue) {
            state.showDeleteModal = newValue
        },
        checkboxValueChange(state, { taskIndex, subtaskIndex }) {
            state.tasks[taskIndex].subtasks[subtaskIndex].checked =
                !state.tasks[taskIndex].subtasks[subtaskIndex].checked
        },
        saveTask(state, { updatedTask, index }) {
            Vue.set(state.tasks, index, updatedTask)
        },
        unshiftNewTask(state, newTask) {
            state.tasks.unshift(newTask)
            state.row.number = 0
        },
        deleteTask(state, index) {
            state.tasks.splice(index, 1)
        },
        localStorageSet(state, tasks) {
            localStorage.setItem("tasks", JSON.stringify(tasks))
        },
    },
    actions: {
        localStorageGet({ commit }) {
            let tasks = localStorage.getItem("tasks")
            if (tasks === null) return
            commit("localStorageGet", JSON.parse(tasks))
        },
        addIncludeElements({ commit }, includeElements) {
            commit("addIncludeElements", includeElements)
        },
        setHistoryState({ commit, getters }) {
            commit("setHistoryState", getters.taskStringified)
        },
        updateRow({ commit, getters, dispatch }, rowNumber) {
            if (rowNumber === -1) {
                commit("updateRowIsActive", false)
                return
            }
            commit("updateRowIsActive", true)
            commit("updateRowNumber", rowNumber)
            if (getters.actionIsActive === false) return
            commit("deactivateRowAndAction")
            switch (getters.actionName) {
                case "edit":
                    commit("showTaskModal", true)
                    dispatch("setHistoryState")
                    break
                case "delete":
                    commit("showDeleteModal", true)
                    break
                default:
                    break
            }
        },
        updateAction({ commit, getters, dispatch }, action) {
            if (
                action === "" ||
                (action === getters.actionName &&
                    getters.actionIsActive === true)
            ) {
                commit("updateActionIsActive", false)
                return
            }
            commit("updateActionIsActive", true)
            commit("updateActionName", action)
            if (action === "add") {
                commit("showTaskModal", true)
                commit("deactivateRowAndAction")
                return
            }
            if (getters.rowIsActive === false) return
            commit("deactivateRowAndAction")
            switch (action) {
                case "edit":
                    commit("showTaskModal", true)
                    dispatch("setHistoryState")
                    break
                case "delete":
                    commit("showDeleteModal", true)
                    break
                default:
                    break
            }
        },
        updateHistory({ commit, getters }, taskObject) {
            commit("updateHistory", {
                newTaskState: JSON.stringify(taskObject),
                index: getters.historyArrayIndex,
            })
        },
        historyStep({ commit }, step) {
            commit("historyStep", step)
        },
        checkboxValueChange({ commit, getters }, { taskIndex, subtaskIndex }) {
            commit("checkboxValueChange", { taskIndex, subtaskIndex })
            commit("localStorageSet", getters.tasks)
        },
        saveTask({ commit, getters }, taskObject) {
            commit("saveTask", {
                updatedTask: JSON.parse(JSON.stringify(taskObject)),
                index: getters.rowNumber,
            })
            commit("localStorageSet", getters.tasks)
        },
        unshiftNewTask({ commit, getters }, taskObject) {
            commit("unshiftNewTask", JSON.parse(JSON.stringify(taskObject)))
            commit("localStorageSet", getters.tasks)
        },
        deleteTask({ commit, getters }) {
            commit("deleteTask", getters.rowNumber)
            commit("localStorageSet", getters.tasks)
        },
        closeTaskModal({ commit }) {
            commit("showTaskModal", false)
        },
        closeDeleteModal({ commit }) {
            commit("showDeleteModal", false)
        },
    },
})

function getMock() {
    return [
        {
            taskName: "Покупки",
            subtasks: [
                {
                    name: "Апельсины",
                    checked: false,
                },
                {
                    name: "Яблоки",
                    checked: true,
                },
                {
                    name: "Лук",
                    checked: false,
                },
                {
                    name: "Курица",
                    checked: false,
                },
                {
                    name: "Плавленый сыр",
                    checked: true,
                },
                {
                    name: "Печенье",
                    checked: false,
                },
                {
                    name: "Торт",
                    checked: false,
                },
            ],
        },
        {
            taskName: "Дом",
            subtasks: [
                {
                    name: "Уборка",
                    checked: true,
                },
                {
                    name: "Посуда",
                    checked: false,
                },
                {
                    name: "Стирка",
                    checked: true,
                },
            ],
        },
        {
            taskName: "Учёба",
            subtasks: [
                {
                    name: "Культура профессиональной коммуникации",
                    checked: true,
                },
                {
                    name: "ТПР",
                    checked: false,
                },
                {
                    name: "Социология",
                    checked: false,
                },
                {
                    name: "БД",
                    checked: true,
                },
                {
                    name: "ООП",
                    checked: false,
                },
                {
                    name: "МИСПРИС",
                    checked: false,
                },
            ],
        },
    ]
}
