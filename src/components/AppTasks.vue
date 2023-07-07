<template>
    <div>
        <v-simple-table>
            <thead>
                <tr class="header-row">
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
                    class="body-row"
                    v-for="(task, index) in tasks"
                    :key="task.id"
                    @click="updateRow(index)"
                    :class="{
                        'chosen-row': isChosen(index),
                        'choose-to-edit': isEditMode,
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
    import { mapActions, mapState } from "vuex"
    import AppSubtasks from "./AppSubtasks.vue"

    export default {
        name: "AppTasks",
        components: {
            AppSubtasks,
        },
        computed: {
            ...mapState(["tasks", "clickInclude", "row", "action"]),
            isDeleteMode() {
                return this.action.name === "delete" && this.action.isActive
            },
            isEditMode() {
                return this.action.name === "edit" && this.action.isActive
            },
        },
        methods: {
            ...mapActions([
                "addIncludeElements",
                "checkboxValueChange",
                "updateRow",
            ]),
            isChosen(index) {
                return this.row.isActive && index === this.row.number
            },
            cancelRow() {
                this.updateRow(-1)
            },
            invokeOutsideClick() {
                return this.row.isActive
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
    .chosen-row {
        background-color: var(--v-third-base);
        &:hover {
            background-color: var(--v-fourth-base) !important;
        }
    }

    .choose-to-edit {
        &:hover {
            background-color: var(--v-third-base) !important;
        }
    }

    .header-row > th {
        width: 50%;
    }
</style>
