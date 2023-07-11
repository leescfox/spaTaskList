<template>
    <v-app-bar app flat height="100px" color="secondary">
        <v-container>
            <div>
                <h2 class="app-title fifth--text">Список заданий</h2>
            </div>
            <div class="mt-2">
                <v-btn
                    ref="addBtn"
                    fab
                    small
                    outlined
                    color="green darken-1"
                    class="mr-3 action-btn"
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
                    class="mr-3 action-btn"
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
                    class="mr-3 action-btn"
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
import { mapState, mapActions } from 'vuex'

export default {
    name: 'AppHeader',
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
        ...mapState(['clickInclude', 'action']),
        iconAdd() {
            return this.action.isActive && this.action.name === 'add'
                ? 'window-close'
                : 'plus'
        },
        iconEdit() {
            return this.action.isActive && this.action.name === 'edit'
                ? 'window-close'
                : 'pencil-outline'
        },
        iconDelete() {
            return this.action.isActive && this.action.name === 'delete'
                ? 'window-close'
                : 'delete-outline'
        },
    },
    methods: {
        ...mapActions(['addIncludeElements', 'updateAction']),
        cancelAction() {
            this.updateAction('')
        },
        invokeOutsideClick() {
            return this.action.isActive
        },
        include() {
            return Array.from(this.clickInclude)
        },
    },
    mounted() {
        this.addIncludeElements([
            this.$refs['addBtn'].$el,
            this.$refs['editBtn'].$el,
            this.$refs['deleteBtn'].$el,
        ])
    },
}
</script>

<style lang="scss" scoped>
.app-title {
    font-family: Roboto, sans-serif;
    line-height: 1;
}
</style>
