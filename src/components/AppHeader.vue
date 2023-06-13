<template>
    <v-app-bar app flat height="100px" color="secondary">
        <v-container>
            <div align="left">
                <h2 class="appTitle fifth--text">Список заданий</h2>
            </div>
            <div class="mt-2" align="left">
                <v-btn
                    ref="addBtn"
                    fab
                    small
                    outlined
                    color="green darken-1"
                    class="mr-3 actionBtn"
                    @click="updateAction('add')"
                    v-click-outside="clickOutside"
                >
                    <v-icon> mdi-{{ iconAdd }} </v-icon>
                </v-btn>
                <v-btn
                    ref="editBtn"
                    fab
                    small
                    outlined
                    color="blue darken-1"
                    class="mr-3 actionBtn"
                    @click="updateAction('edit')"
                    v-click-outside="clickOutside"
                >
                    <v-icon> mdi-{{ iconEdit }} </v-icon>
                </v-btn>
                <v-btn
                    ref="deleteBtn"
                    fab
                    small
                    outlined
                    color="red darken-2"
                    class="mr-3 actionBtn"
                    @click="updateAction('delete')"
                    v-click-outside="clickOutside"
                >
                    <v-icon> mdi-{{ iconDelete }} </v-icon>
                </v-btn>
            </div>
        </v-container>
    </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    name: "AppHeader",
    data() {
        return {
            clickOutside: {
                handler: this.cancelAction,
                closeConditional: this.invokeOutsideClick,
                include: this.include,
            },
        }
    },
    computed: {
        ...mapGetters(["clickInclude", "actionIsActive", "actionName"]),
        iconAdd() {
            return this.actionIsActive && this.actionName === "add"
                ? "window-close"
                : "plus"
        },
        iconEdit() {
            return this.actionIsActive && this.actionName === "edit"
                ? "window-close"
                : "pencil-outline"
        },
        iconDelete() {
            return this.actionIsActive && this.actionName === "delete"
                ? "window-close"
                : "delete-outline"
        },
    },
    methods: {
        ...mapActions(["addIncludeElements", "updateAction"]),
        cancelAction() {
            this.updateAction("")
        },
        invokeOutsideClick() {
            return this.actionIsActive
        },
        include() {
            return Array.from(this.clickInclude)
        },
    },
    mounted() {
        this.addIncludeElements([
            this.$refs["addBtn"].$el,
            this.$refs["editBtn"].$el,
            this.$refs["deleteBtn"].$el,
        ])
    },
}
</script>

<style lang="scss" scoped>
.appTitle {
    font-family: Roboto, sans-serif;
    line-height: 1;
}

.notActive::before {
    background-color: transparent !important;
    transition: background-color 1s;
}
</style>
