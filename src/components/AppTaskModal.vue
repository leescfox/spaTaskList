<template>
    <div>
        <v-dialog
            persistent
            no-click-animation
            max-width="550px"
            v-model="modalState"
        >
            <v-card
                class="fifth--text"
                v-click-outside="{
                    handler: unsavedExitAttempt,
                    closeConditional: isOutsideModalClick,
                }"
            >
                <v-card-title>{{ titleText }}</v-card-title>
                <div class="px-5">
                    <v-card-text class="modal-card-body">
                        <v-row class="modal-card-row">
                            <div class="row-container">
                                <div class="mr-3">Задание:</div>
                                <v-textarea
                                    no-resize
                                    hide-details
                                    outlined
                                    rows="2"
                                    row-height="20"
                                    label="Название задания"
                                    :value="task.taskName"
                                    @change="taskNameChange"
                                />
                            </div>
                        </v-row>
                        <v-row class="modal-card-row">
                            <div class="row-container">
                                <div class="mr-3">Список задач:</div>
                                <v-btn
                                    fab
                                    small
                                    outlined
                                    color="green darken-1"
                                    class="mr-3 action-btn add-subtask-btn"
                                    @click="addSubtask"
                                >
                                    <v-icon> mdi-plus </v-icon>
                                </v-btn>
                                <v-btn
                                    fab
                                    small
                                    outlined
                                    color="red darken-2"
                                    class="action-btn"
                                    @click="deleteSubtaskClick"
                                    v-click-outside="{
                                        handler: deleteSubtaskClickOutside,
                                        include: include,
                                    }"
                                >
                                    <v-icon> mdi-{{ iconDelete }} </v-icon>
                                </v-btn>
                            </div>
                        </v-row>
                        <v-row class="modal-card-row">
                            <div class="row-container">
                                <v-simple-table
                                    class="tasks-table"
                                    height="35vh"
                                >
                                    <thead>
                                        <tr class="header-row">
                                            <th class="status-cell">Статус</th>
                                            <th>Название задачи</th>
                                        </tr>
                                    </thead>
                                    <tbody class="modal-tbody">
                                        <tr
                                            class="body-row"
                                            v-for="(
                                                subtask, index
                                            ) in task.subtasks"
                                            :key="subtask.id"
                                            @click="subtaskRowClick(index)"
                                        >
                                            <td class="сheckbox-cell px-0">
                                                <div
                                                    class="overlay"
                                                    v-show="deleteSubtaskMode"
                                                ></div>
                                                <v-simple-checkbox
                                                    color="primary"
                                                    :value="subtask.checked"
                                                    @input="
                                                        checkboxValueChange(
                                                            $event,
                                                            index
                                                        )
                                                    "
                                                />
                                            </td>
                                            <td class="px-1">
                                                <v-text-field
                                                    :ref="
                                                        (el) =>
                                                            setFirstElemRef(
                                                                el,
                                                                index
                                                            )
                                                    "
                                                    placeholder="Название задачи"
                                                    solo
                                                    dense
                                                    clearable
                                                    hide-details
                                                    :value="subtask.name"
                                                    @change="
                                                        subtaskValueChange(
                                                            $event,
                                                            index
                                                        )
                                                    "
                                                    @blur="
                                                        focusLose($event, index)
                                                    "
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-simple-table>
                            </div>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <div class="row-container actions-row">
                            <div class="mr-6">
                                <v-btn
                                    fab
                                    small
                                    outlined
                                    color="grey darken-3"
                                    class="mr-3 action-btn"
                                    :disabled="undoDisabled"
                                    @click="undoRedo(-1)"
                                >
                                    <v-icon> mdi-undo </v-icon>
                                </v-btn>
                                <v-btn
                                    fab
                                    small
                                    outlined
                                    color="grey darken-3"
                                    class="action-btn"
                                    :disabled="redoDisabled"
                                    @click="undoRedo(1)"
                                >
                                    <v-icon> mdi-redo </v-icon>
                                </v-btn>
                            </div>
                            <div>
                                <v-btn
                                    outlined
                                    color="green darken-1"
                                    class="mr-3"
                                    :disabled="isSaved"
                                    @click="save"
                                >
                                    Сохранить
                                </v-btn>
                                <v-btn
                                    outlined
                                    color="red darken-2"
                                    @click="unsavedExitAttempt"
                                >
                                    Выход
                                </v-btn>
                            </div>
                        </div>
                    </v-card-actions>
                </div>
            </v-card>
        </v-dialog>
        <v-dialog persistent max-width="400px" v-model="unsavedExitModal">
            <v-card color="secondary">
                <v-card-title class="fifth--text">
                    Выйти без сохранения?
                </v-card-title>
                <v-card-text class="py-0 modal-card-body">
                    Вы действительно хотите выйти не сохранив изменения?
                </v-card-text>
                <v-card-actions class="row-container actions-row">
                    <v-btn
                        outlined
                        color="red darken-2"
                        @click="closeExitModal(true)"
                    >
                        Да
                    </v-btn>
                    <v-btn
                        outlined
                        color="green darken-1"
                        @click="closeExitModal(false)"
                    >
                        Нет
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
    name: 'AppTaskModal',
    data() {
        return {
            task: {
                taskName: '',
                subtasks: [],
            },
            deleteSubtaskMode: false,
            tbody: [],
            includeAdded: false,
            isSaved: true,
            unsavedExitModal: false,
            isNewTaskAdded: false,
            firstSubtask: null,
            currentStep: 0,
        }
    },
    computed: {
        ...mapState([
            'action',
            'showTaskModal',
            'historyArray',
            'historyArrayIndex',
        ]),
        ...mapGetters(['taskStringified', 'historyArrayCurrentElement']),
        modalState: {
            get() {
                return this.showTaskModal
            },
            set() {
                this.closeTaskModal()
            },
        },
        titleText() {
            return `${
                this.action.name === 'add' ? 'Добавить' : 'Редактировать'
            } задание`
        },
        iconDelete() {
            return this.deleteSubtaskMode ? 'window-close' : 'delete-outline'
        },
        undoDisabled() {
            return this.historyArrayIndex === 0
        },
        redoDisabled() {
            return this.historyArrayIndex + 1 === this.historyArray.length
        },
    },
    methods: {
        ...mapActions([
            'returnUniqueId',
            'closeTaskModal',
            'setHistoryState',
            'updateHistory',
            'historyStep',
            'saveTask',
            'unshiftNewTask',
        ]),
        unsavedExitAttempt() {
            if (this.isSaved === false) {
                this.unsavedExitModal = true
                return
            }
            this.closeTaskModal()
        },
        isOutsideModalClick() {
            return this.showTaskModal && !this.unsavedExitModal
        },
        closeExitModal(answer) {
            this.unsavedExitModal = false
            if (answer) {
                this.closeTaskModal()
            }
        },
        update() {
            this.updateHistory(this.task)
            this.isSaved = false
        },
        setFirstElemRef(ref, index) {
            if (index !== 0) {
                return
            }
            this.firstSubtask = ref
        },
        async addSubtask() {
            if (this.task.subtasks.length > 0) {
                let value = this.task.subtasks[0].name
                if (value === '' || value === null) {
                    this.firstSubtask.$refs.input.focus()
                    return
                }
            }
            let newId = await this.returnUniqueId()
            this.task.subtasks.unshift({
                checked: false,
                name: '',
                id: newId,
            })
            this.update()
            this.$nextTick(() => {
                this.firstSubtask.$refs.input.focus()
            })
        },
        deleteSubtaskClick() {
            this.deleteSubtaskMode = !this.deleteSubtaskMode
        },
        deleteSubtaskClickOutside() {
            this.deleteSubtaskMode = false
        },
        include() {
            if (this.includeAdded === false) {
                this.tbody = document.getElementsByClassName('modal-tbody')
                this.includeAdded = true
            }
            return Array.from(this.tbody)
        },
        subtaskRowClick(index) {
            if (this.deleteSubtaskMode) {
                this.task.subtasks.splice(index, 1)
                this.update()
            }
        },
        taskNameChange(value) {
            this.task.taskName = value
            this.update()
        },
        checkboxValueChange(value, index) {
            this.task.subtasks[index].checked = value
            this.update()
        },
        subtaskValueChange(value, index) {
            if (this.task.subtasks[index].name === value) {
                return
            }
            this.task.subtasks[index].name = value
            this.update()
        },
        focusLose(e, index) {
            if (e.relatedTarget === null) {
                return
            }
            if (
                e.relatedTarget.classList.contains('add-subtask-btn') &&
                index === 0
            ) {
                return
            }
            let value = this.task.subtasks[index].name
            if (value === '' || value === null) {
                this.task.subtasks.splice(index, 1)
                this.update()
            }
        },
        undoRedo(step) {
            this.historyStep(step)
            this.task = JSON.parse(this.historyArrayCurrentElement)
            this.isSaved = this.currentStep === this.historyArrayIndex
        },
        save() {
            let wasDeleted = false
            let value = ''
            for (let i = 0; i < this.task.subtasks.length; i++) {
                value = this.task.subtasks[i].name
                if (value !== '' && value !== null) {
                    continue
                }
                this.task.subtasks.splice(i, 1)
                wasDeleted = true
            }
            if (wasDeleted) {
                this.updateHistory(this.task)
            }
            if (this.action.name === 'add' && this.isNewTaskAdded === false) {
                this.unshiftNewTask(this.task)
                this.isNewTaskAdded = true
            } else {
                this.saveTask(this.task)
            }
            this.isSaved = true
            this.currentStep = this.historyArrayIndex
        },
    },
    watch: {
        showTaskModal(newValue) {
            if (newValue) {
                this.isSaved = true
                this.isNewTaskAdded = false
                this.firstSubtask = null
                this.currentStep = 0
                this.task = JSON.parse(this.taskStringified)
                this.setHistoryState()
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.modal-card-body {
    font-size: 1rem;
}

.modal-card-row {
    margin: 20px 0 0 0;
    &:first-of-type {
        margin: 0;
    }
}

.row-container {
    display: flex;
    align-items: center;
    width: 100%;
    &.actions-row {
        justify-content: end;
    }
}

.tasks-table {
    width: 100%;
    .header-row {
        .status-cell {
            width: 0%;
        }
    }
}

.сheckbox-cell {
    display: flex;
    justify-content: center;
    .v-input--selection-controls__input {
        margin: 0;
    }
}
</style>
