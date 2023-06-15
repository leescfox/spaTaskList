<template>
    <div>
        <v-simple-table>
            <thead>
                <tr class="headerRow">
                    <th>Задания</th>
                    <th>Задачи</th>
                </tr>
            </thead>
            <tbody
                ref="tasksBody"
                v-click-outside="{
                    handler: cancelRow,
                    closeConditional: invokeOutsideClick,
                    include: include,
                }"
                class="fifth--text"
            >
                <tr
                    class="bodyRow"
                    v-for="(task, index) in tasks"
                    :key="index"
                    @click="updateRow(index)"
                    :class="{
                        chosenRow: isChosen(index),
                        chooseToEdit: isEditMode,
                    }"
                >
                    <td>
                        <div class="overlay" v-show="isDeleteMode"></div>
                        <span>{{ task.taskName }}</span>
                    </td>
                    <td>
                        <AppSubtasks
                            :subtasks="task.subtasks"
                            @checkbox-value-change="
                                checkboxValueChange({
                                    taskIndex: index,
                                    subtaskIndex: $event,
                                })
                            "
                        />
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import AppSubtasks from "./AppSubtasks.vue"

export default {
    name: "AppTasks",
    components: {
        AppSubtasks,
    },
    computed: {
        ...mapGetters([
            "tasks",
            "clickInclude",
            "rowIsActive",
            "rowNumber",
            "actionName",
            "actionIsActive",
        ]),
        isDeleteMode() {
            return this.actionName === "delete" && this.actionIsActive
        },
        isEditMode() {
            return this.actionName === "edit" && this.actionIsActive
        },
    },
    methods: {
        ...mapActions([
            "addIncludeElements",
            "checkboxValueChange",
            "updateRow",
        ]),
        isChosen(index) {
            return this.rowIsActive && index === this.rowNumber
        },
        cancelRow() {
            this.updateRow(-1)
        },
        invokeOutsideClick() {
            return this.rowIsActive
        },
        include() {
            return Array.from(this.clickInclude)
        },
    },
    mounted() {
        this.addIncludeElements([this.$refs["tasksBody"]])
    },
}
</script>

<style lang="scss" scoped>
.chosenRow {
    background-color: var(--v-third-base);
    &:hover {
        background-color: var(--v-fourth-base) !important;
    }
}

.chooseToEdit {
    &:hover {
        background-color: var(--v-third-base) !important;
    }
}

.headerRow > th {
    width: 50%;
}
</style>
