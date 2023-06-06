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
                class="headerAndTasksInclude"
                v-click-outside="{
                    handler: cancelRow,
                    closeConditional: invokeOutsideClick,
                    include: include,
                }"
            >
                <tr
                    v-for="(task, index) in tasks"
                    :key="index"
                    @click="updateRow(index)"
                    :class="{ chosenRow: isChosen(index) }"
                    class="bodyRow"
                >
                    <td>{{ task.taskName }}</td>
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
        ...mapGetters(["tasks", "clickInclude", "rowIsActive", "rowNumber"]),
    },
    methods: {
        ...mapActions(["checkboxValueChange", "updateRow"]),
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
}
</script>

<style lang="scss" scoped>
.chosenRow {
    background-color: #bbdefb;
    &:hover {
        background-color: #90caf9 !important;
    }
}

.headerRow > th {
    width: 50%;
}
</style>
