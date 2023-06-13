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
                    <v-card-text class="modalCardBody">
                        <v-row class="modalCardRow">
                            <div class="rowContainer">
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
                                ></v-textarea>
                            </div>
                        </v-row>
                        <v-row class="modalCardRow">
                            <div class="rowContainer">
                                <div class="mr-3">Список задач:</div>
                                <v-btn
                                    fab
                                    small
                                    outlined
                                    color="green darken-1"
                                    class="mr-3 actionBtn addSubtaskBtn"
                                    @click="addSubtask"
                                >
                                    <v-icon> mdi-plus </v-icon>
                                </v-btn>
                                <v-btn
                                    fab
                                    small
                                    outlined
                                    color="red darken-2"
                                    class="actionBtn"
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
                        <v-row class="modalCardRow">
                            <div class="rowContainer">
                                <v-simple-table
                                    class="tasksTable"
                                    height="35vh"
                                >
                                    <thead>
                                        <tr class="headerRow">
                                            <th class="statusCell">Статус</th>
                                            <th>Название задачи</th>
                                        </tr>
                                    </thead>
                                    <tbody class="modalTBody">
                                        <tr
                                            class="bodyRow"
                                            v-for="(
                                                subtask, index
                                            ) in task.subtasks"
                                            :key="index"
                                            @click="subtaskRowClick(index)"
                                        >
                                            <td class="сheckboxCell px-0">
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
                                                ></v-simple-checkbox>
                                            </td>
                                            <td class="px-1">
                                                <v-text-field
                                                    ref="subtaskInput"
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
                                                ></v-text-field>
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-simple-table>
                            </div>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <div class="rowContainer actionsRow">
                            <div class="mr-6">
                                <v-btn
                                    fab
                                    small
                                    outlined
                                    color="grey darken-3"
                                    class="mr-3 actionBtn"
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
                                    class="actionBtn"
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
                <v-card-title class="fifth--text"
                    >Выйти без сохранения?</v-card-title
                >
                <v-card-text class="py-0 modalCardBody"
                    >Вы действительно хотите выйти не сохранив
                    изменения?</v-card-text
                >
                <v-card-actions class="rowContainer actionsRow">
                    <v-btn
                        outlined
                        color="red darken-2"
                        @click="closeExitModal(true)"
                        >Да</v-btn
                    >
                    <v-btn
                        outlined
                        color="green darken-1"
                        @click="closeExitModal(false)"
                        >Нет</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    name: "AppTaskModal",
    data() {
        return {
            task: {
                taskName: "",
                subtasks: [],
            },
            deleteSubtaskMode: false,
            tbody: [],
            includeAdded: false,
            isSaved: true,
            unsavedExitModal: false,
            isNewTaskAdded: false,
        }
    },
    computed: {
        ...mapGetters([
            "showTaskModal",
            "actionName",
            "taskStringified",
            "historyArrayLength",
            "historyArrayIndex",
            "historyArrayCurrentElement",
        ]),
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
                this.actionName === "add" ? "Добавить" : "Редактировать"
            } задание`
        },
        iconDelete() {
            return this.deleteSubtaskMode === true
                ? "window-close"
                : "delete-outline"
        },
        undoDisabled() {
            return this.historyArrayIndex === 0
        },
        redoDisabled() {
            return this.historyArrayIndex + 1 === this.historyArrayLength
        },
    },
    methods: {
        ...mapActions([
            "closeTaskModal",
            "setHistoryState",
            "updateHistory",
            "historyStep",
            "saveTask",
            "unshiftNewTask",
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
            if (answer === true) this.closeTaskModal()
        },
        update() {
            this.updateHistory(this.task)
            this.isSaved = false
        },
        addSubtask() {
            if (this.task.subtasks.length > 0) {
                let value = this.task.subtasks[0].name
                if (value === "" || value === null) {
                    this.$refs["subtaskInput"][0].$refs.input.focus()
                    return
                }
            }
            this.task.subtasks.unshift({
                checked: false,
                name: "",
            })
            this.update()
            this.$nextTick(() => {
                this.$refs["subtaskInput"][0].$refs.input.focus()
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
                this.tbody = document.getElementsByClassName("modalTBody")
                this.includeAdded = true
            }
            return Array.from(this.tbody)
        },
        subtaskRowClick(index) {
            if (this.deleteSubtaskMode === true) {
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
            if (this.task.subtasks[index].name === value) return
            this.task.subtasks[index].name = value
            this.update()
        },
        focusLose(e, index) {
            if (e.relatedTarget === null) return
            if (
                e.relatedTarget.classList.contains("addSubtaskBtn") === true &&
                index === 0
            ) {
                return
            }
            let value = this.task.subtasks[index].name
            if (value === "" || value === null) {
                this.task.subtasks.splice(index, 1)
                this.update()
            }
        },
        undoRedo(step) {
            this.historyStep(step)
            this.task = JSON.parse(this.historyArrayCurrentElement)
        },
        save() {
            let wasDeleted = false
            let value = ""
            for (let i = 0; i < this.task.subtasks.length; i++) {
                value = this.task.subtasks[i].name
                if (value !== "" && value !== null) continue
                this.task.subtasks.splice(i, 1)
                wasDeleted = true
            }
            if (wasDeleted === true) {
                this.updateHistory(this.task)
            }
            if (this.actionName === "add" && this.isNewTaskAdded === false) {
                this.unshiftNewTask(this.task)
                this.isNewTaskAdded = true
            } else {
                this.saveTask(this.task)
            }
            this.isSaved = true
        },
    },
    watch: {
        showTaskModal(newValue) {
            if (newValue === true) {
                this.isSaved = true
                this.isNewTaskAdded = false
                this.task = JSON.parse(this.taskStringified)
                this.setHistoryState()
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.modalCardBody {
    font-size: 1rem;
}

.modalCardRow {
    margin: 20px 0 0 0;
    &:first-of-type {
        margin: 0;
    }
}

.rowContainer {
    display: flex;
    align-items: center;
    width: 100%;
    &.actionsRow {
        justify-content: end;
    }
}

.tasksTable {
    width: 100%;
    .headerRow {
        .statusCell {
            width: 0%;
        }
    }
}

.сheckboxCell {
    display: flex;
    justify-content: center;
    .v-input--selection-controls__input {
        margin: 0;
    }
}
</style>
